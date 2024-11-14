import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../Utils/Color';

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
      },
      headers: {
        'User-Agent': 'sikadu/1.0.0'
      }
    });

    if (response.data && response.data.address) {
      const address = response.data.address;
      const road = address.road || '';
      const neighbourhood = address.neighbourhood || '';
      const cityDistrict = address.city_district || '';
      const city = address.city || '';
      const state = address.state || '';
      const postcode = address.postcode || '';

      // Construct full address
      let fullAddress = `${road}, `;
      if (neighbourhood) fullAddress += `${neighbourhood}, `;
      if (cityDistrict) fullAddress += `${cityDistrict}, `;
      if (city) fullAddress += `Kota ${city}, `;
      if (state) fullAddress += `${state} `;
      if (postcode) fullAddress += `${postcode}`;

      return fullAddress.trim();
    } else {
      throw new Error('Gagal mengambil data alamat');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Gagal mengambil data alamat';
  }
};

export default function AktivitasScreen() {
  const [pengaduanList, setPengaduanList] = useState([]);
  const [aspirasiList, setAspirasiList] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Pengaduan');
  const navigation = useNavigation();

  const navigateToDetailLaporan = (pengaduan) => {
    navigation.navigate('Detail Laporan', { pengaduan });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (selectedTab === 'Pengaduan') {
        fetchData('pengaduans', setPengaduanList);
      } else if (selectedTab === 'Aspirasi') {
        fetchData('aspirasis', setAspirasiList);
      }
    }, [selectedTab])
  );

  const fetchData = async (endpoint, setData) => {
    try {
      const nik = await AsyncStorage.getItem('nik');
      if (nik) {
        const response = await fetch(`https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/${endpoint}?nik=${nik}`);
        const text = await response.text();
        const data = JSON.parse(text);

        if (response.ok) {
          if (data && Array.isArray(data.data.data)) {
            const userItems = await Promise.all(data.data.data.filter(item => item.nik === nik).map(async item => {
              console.log('Item:', item);  // Log item untuk memeriksa data

              let alamat = 'Lokasi tidak tersedia';

              if (item.lokasi_pengaduan) {
                const [latitude, longitude] = item.lokasi_pengaduan.split(',').map(coord => parseFloat(coord));
                if (!isNaN(latitude) && !isNaN(longitude)) {
                  alamat = await reverseGeocode(latitude, longitude);
                }
              }

              return { ...item, alamat };
            }));
            setData(userItems);
          } else {
            throw new Error('Data yang diterima tidak valid');
          }
        } else {
          throw new Error(data.message || 'Gagal mengambil data');
        }
      } else {
        throw new Error('NIK tidak ditemukan');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Pengaduan' && styles.activeTab]} 
          onPress={() => setSelectedTab('Pengaduan')}
        >
          <Text style={[styles.tabText, selectedTab === 'Pengaduan' && styles.activeTabText]}>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Aspirasi' && styles.activeTab]} 
          onPress={() => setSelectedTab('Aspirasi')}
        >
          <Text style={[styles.tabText, selectedTab === 'Aspirasi' && styles.activeTabText]}>Aspirasi</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Pengaduan' ? (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {pengaduanList.length > 0 ? (
            pengaduanList.map((pengaduan) => (
              <View key={pengaduan.id} style={styles.card}>
                <Image
                  source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/pengaduan/" + pengaduan.foto_pengaduan }} 
                  style={styles.cardImage} 
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{pengaduan.permasalahan}</Text>
                  <Text style={styles.cardText}>{pengaduan.alamat}</Text>
                  <Text style={styles.cardText}>{pengaduan.jenis.nama_jenis_aduan}</Text>
                  <Text style={styles.cardText}>{pengaduan.tgl_pengaduan}</Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigateToDetailLaporan(pengaduan)}>
                    <Text style={styles.buttonText}>Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Tidak ada pengaduan yang ditemukan.</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {aspirasiList.length > 0 ? (
            aspirasiList.map((aspirasi) => (
              <View key={aspirasi.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{aspirasi.judul_aspirasi}</Text>
                  <Text style={styles.cardText}>Jenis Kategori: {aspirasi.jenis.nama_jenis_aduan}</Text>
                  <Text style={styles.cardText}>Tanggal aspirasi: {aspirasi.tgl_aspirasi}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Tidak ada aspirasi yang ditemukan.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.HIJAU1,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: Colors.HIJAU1,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  button: {
    backgroundColor: Colors.HIJAU1,
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
