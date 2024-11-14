import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';

export default function AspirasiScreen({ route, navigation }) {
  const { idJenisAduan, namaJenisAduan, NIK } = route.params;
  const [jenisKategori, setJenisKategori] = useState(namaJenisAduan || '');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('judul_aspirasi', problem); // Menyesuaikan sesuai kebutuhan server
    formData.append('isi_aspirasi', description); // Menyesuaikan sesuai kebutuhan server
    formData.append('nik', NIK);
    formData.append('id_jenis_aduan', idJenisAduan); // Pastikan idJenisAduan sudah tersedia dari route.params
  
    try {
      const response = await axios.post('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/aspirasis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      Alert.alert('Success', 'Aspirasi berhasil disimpan');
      navigation.navigate('Aktivitas'); // Navigasi ke halaman aktivitas setelah berhasil disimpan
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response && error.response.data.message ? error.response.data.message : 'Terjadi kesalahan saat menyimpan aspirasi');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Jenis Kategori Aduan</Text>
      <TextInput
        style={styles.input}
        value={jenisKategori}
        editable={false}
      />

      <Text style={styles.title}>Judul Aspirasi</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan permasalahan Anda"
        value={problem}
        onChangeText={setProblem}
        multiline={true}
      />

      <Text style={styles.title}>Isi Aspirasi </Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan keterangan Anda"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <Text style={styles.title}>NIK</Text>
      <TextInput
        style={styles.input}
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
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 10,
  },
  input: {
    height: 80,
    width: '100%',
    backgroundColor: '#F2F2F2',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
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
});
