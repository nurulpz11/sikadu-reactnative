import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    nama_masyarakat: '',
    telp_masyarakat: '',
    email_masyarakat: '',
    nik: '',
    kata_sandi_masyarakat: '',
    foto_masyarakat: '', // Tambahkan foto_masyarakat ke state
  });
  const navigation = useNavigation();

  const fetchProfileData = async () => {
    try {
      const nik = await AsyncStorage.getItem('nik');
      if (!nik) {
        Alert.alert('Error', 'NIK tidak ditemukan');
        return;
      }

      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/masyarakats');
      const data = await response.json();

      if (response.ok) {
        const userProfile = data.data.data.find(item => item.nik === parseInt(nik));
        if (userProfile) {
          setProfileData(userProfile);
        } else {
          Alert.alert('Error', 'Profil tidak ditemukan');
        }
      } else {
        throw new Error(data.message || 'Gagal mengambil data profil');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal mengambil data profil. Silakan coba lagi.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const handleEditProfile = () => {
    if (profileData.nik) {
      navigation.navigate('Ubah Profil', { profileData });
    } else {
      Alert.alert('Error', 'NIK tidak tersedia');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('nik');
      navigation.reset({
        index: 0,
        routes: [{ name: 'FormLogin' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
    }
  };

  const handleNavigateToTentang = () => {
    navigation.navigate('Tentang'); // Navigasi ke TentangScreen
  };
  
  const handleNavigateToSnK = () => {
    navigation.navigate('SnK'); // Navigasi ke TentangScreen
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileContent}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Hai, {profileData.nama_masyarakat}</Text>
              <Text style={styles.profileDetails}>{profileData.nik}</Text>
            </View>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileData.foto_masyarakat
                    ? { uri: `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/masyarakat/${profileData.foto_masyarakat}` }
                    : require('./../../../assets/images/profile.png')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editIconContainer} onPress={handleEditProfile}>
                  <Image source={require('./../../../assets/images/edit.png')} style={styles.editIcon} />
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
          <View style={styles.rowLeft}>
            <Image source={require('./../../../assets/images/informasi.png')} style={styles.icon} />
            <Text style={styles.text}>Edit informasi profil</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}onPress={handleNavigateToTentang}>
          <View style={styles.rowLeft}>
            <Image source={require('./../../../assets/images/info.png')} style={styles.icon} />
            <Text style={styles.text}>Tentang Aplikasi Sikadu</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}onPress={handleNavigateToSnK}> 
          <View style={styles.rowLeft}>
            <Image source={require('./../../../assets/images/flag.png')} style={styles.icon} />
            <Text style={styles.text}>Syarat dan Ketentuan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Image source={require('./../../../assets/images/privacy.png')} style={styles.icon} />
            <Text style={styles.text}>Kebijakan Privasi</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
        <View style={styles.rowLeft}>
          <Image source={require('./../../../assets/images/logout.png')} style={styles.icon} />
          <Text style={styles.logoutText}>Keluar</Text>
        </View>
      </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  profileHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
  },
  profileImageContainer: {
    marginLeft: 20,
    position: 'relative', // Added to enable absolute positioning of the edit icon
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white', // Optional: background color for the edit icon
    borderRadius: 15, // Make the background circle
    padding: 5, // Optional: padding to make the icon fit well within the circle
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 30,
    marginLeft: -70
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  logoutRow: {
    marginTop: 17, // Adjust this value to create desired spacing
  },
  logoutText: {
    fontSize: 16,
    flex: 1,
    color:'#CA1D1D',
    fontWeight:'500',
  }
});
