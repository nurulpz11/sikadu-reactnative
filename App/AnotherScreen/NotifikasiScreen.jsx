import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotifikasiScreen() {
  const [notifications, setNotifications] = useState([]);
  const [userNik, setUserNik] = useState(null);

  useEffect(() => {
    const getNik = async () => {
      try {
        const nik = await AsyncStorage.getItem('nik');
        setUserNik(nik);
        console.log('Fetched nik from AsyncStorage:', nik); // Debug log
      } catch (error) {
        console.error('Failed to get nik from AsyncStorage:', error);
      }
    };
    getNik();
  }, []);

  useEffect(() => {
    if (userNik) {
      const pusher = new Pusher('6a260fa3e4660736f2dc', {
        cluster: 'ap1',
      });

      const channel = pusher.subscribe('SIKADU');
      console.log('Pusher subscribed to channel SIKADU');

      channel.bind('tanggapan-baru', function(data) {
        console.log('Received tanggapan-baru event:', data);
        updateNotifications(data.tanggapan);
      });

      channel.bind('tanggapan-updated', function(data) {
        console.log('Received tanggapan-updated event:', data);
        updateNotifications(data.tanggapan);
      });

      // Load notifications from AsyncStorage
      loadNotifications();

      return () => {
        pusher.unsubscribe('SIKADU');
      };
    }
  }, [userNik]);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      console.log('Stored notifications:', storedNotifications); // Debug log

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        const filteredNotifications = parsedNotifications.filter(notification => notification.nik === userNik);
        setNotifications(filteredNotifications);
        console.log('Loaded and filtered notifications:', filteredNotifications); // Debug log
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const updateNotifications = (newNotification) => {
    setNotifications(prevNotifications => {
      const updatedNotifications = [...prevNotifications, newNotification];
      AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainerColumn}>
                <Text style={styles.textMessage}>Status {String(notification.message)}, Pengaduan dengan ID: {String(notification.id_pengaduan)},  {notification.status_tanggapan === '0' ? 'Belum di Proses' : String(notification.status_tanggapan)}</Text>
                
                <Text style={styles.tanggalTanggapan}>{String(notification.tgl_tanggapan)}</Text>
      
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingLeft: 20,
  },
  notificationsContainer: {
    width: '100%',
  },
  card: {
    width: '95%',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    padding: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainerColumn: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  textMessage: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  statusTanggapan: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  tanggalTanggapan: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  nikText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
});
