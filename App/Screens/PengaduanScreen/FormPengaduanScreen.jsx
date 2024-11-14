import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function FormPengaduan({ route, navigation }) {
  const { idJenisAduan, namaJenisAduan, NIK } = route.params;
  const [photo, setPhoto] = useState(null);
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [latitudeText, setLatitudeText] = useState('');
  const [longitudeText, setLongitudeText] = useState('');
  const [address, setAddress] = useState('');
  const [jenisKategori, setJenisKategori] = useState(namaJenisAduan || '');

  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      }

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need location permissions to make this work!');
      }
    };

    getPermissions();
  }, []);

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

      console.log('Reverse geocoding response:', response.data);

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

  const handleTakePhoto = async () => {
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhoto(manipResult);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLatitudeText(location.coords.latitude.toString());
      setLongitudeText(location.coords.longitude.toString());

      // Get address from coordinates
      const fullAddress = await reverseGeocode(location.coords.latitude, location.coords.longitude);
      setAddress(fullAddress);
    }
  };

  const handleSubmit = async () => {
    if (photo) {
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.size > 5120 * 1024) {
        Alert.alert('Error', 'Ukuran file foto tidak boleh lebih dari 5MB');
        return;
      }
    }

    const formData = new FormData();
    formData.append('permasalahan', problem);
    formData.append('keterangan', description);
    formData.append('lokasi_pengaduan', `${location.latitude},${location.longitude}`);
    formData.append('id_jenis_aduan', idJenisAduan);
    formData.append('nik', NIK);
    if (photo) {
      formData.append('foto_pengaduan', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
    }

    try {
      const response = await axios.post('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/pengaduans', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      Alert.alert('Success', 'Pengaduan berhasil disimpan');
      navigation.navigate('Laporan Saya'); // Navigasi ke halaman aktivitas
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response && error.response.data.message ? error.response.data.message : 'Terjadi kesalahan saat menyimpan pengaduan');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Foto Kaduan</Text>
      <View style={styles.cardPhoto}>
        <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
          <Text style={styles.photoButtonText}>Ambil Foto</Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo.uri }} style={styles.photo} />}


        {location && (
          <View style={styles.locationTextContainer}>
           
            <Text style={styles.locationTitle}>Lokasi Laporan</Text>
            <Text style={styles.locationText}>{address}</Text>
            <Text style={styles.locationDesc}> (Terdeteksi otomatis berdasarkan lokasi yang tersimpan saat pengambilan foto)</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>Permasalahan</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan permasalahan anda"
        value={problem}
        onChangeText={setProblem}
        multiline={true}
      />

      <Text style={styles.title}>Keterangan</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan detail laporan pengaduan anda"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

<Text style={styles.title}>Jenis Kategori Aduan</Text>
      <TextInput
        style={[styles.input, styles.singleLineInput]}
        value={jenisKategori}
        editable={false}
      />

      <Text style={styles.title}>NIK</Text>
      <TextInput
        style={[styles.input, styles.singleLineInput]}
        value={NIK}
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  photo: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  photoButton: {
    width: '30%',
    height: 40,
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  desc: {
    fontSize: 11,
    fontWeight: '400',
    marginVertical: 10,
    color: 'grey',
    marginTop: -7
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    textAlignVertical: 'top',
  },
  singleLineInput: {
    height: 40,
  },
  map: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPhoto: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 8,
  },
  locationTextContainer: {
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight:'600',
    marginBottom:5,
  },
  locationTitle: {
    fontSize: 15,
    color: 'grey',
    fontWeight:'500',
    marginBottom:5,
  },
  locationDesc: {
    fontSize: 14,
    color: 'grey',
    fontWeight:'300',
    marginBottom:5,
    textAlign:'left',
  },
});
