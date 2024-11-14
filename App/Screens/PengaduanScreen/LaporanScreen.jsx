import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LaporanScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigate = (option) => {
    let formScreen = 'Form Pengaduan'; // Default ke FormPengaduanScreen
    if (option === 'Aspirasi') {
      formScreen = 'FormAspirasiScreen';
    }
    navigation.navigate('Kategori', { reportType: option, formScreen });
  };

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buat Laporan</Text>
      <Text style={styles.subHeader}>Pilih klasifikasi laporan</Text>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleNavigate('Pengaduan')}
      >
        <Text style={styles.optionHeader}>Pengaduan</Text>
        <Text style={styles.optionText}>
          Laporan atau keluhan tentang ketidakpuasan terhadap pelayanan publik yang diterima,
          seperti buruknya kualitas layanan, penyimpangan prosedur, atau perilaku tidak pantas dari petugas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleNavigate('Aspirasi')}
      >
        <Text style={styles.optionHeader}>Aspirasi</Text>
        <Text style={styles.optionText}>
          Harapan, usulan, atau saran terkait dengan peningkatan kualitas
          pelayanan publik, kebijakan, atau program yang ada
        </Text>
      </TouchableOpacity>
      <Text style={styles.linkText}>
        Baca tata cara melakukan pengaduan <Text style={styles.link} onPress={handleModal}>disini</Text>
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tata Cara Melakukan Pengaduan</Text>
            <Text style={styles.modalText}>
              1. Pilih menu "Lapor" di halaman utama aplikasi SIKADU.
              {"\n"}2. Pilih kategori pengaduan yang sesuai.
              {"\n"}3. Pilih jenis pengaduan berdasarkan kategori yang sudah dipilih sebelumnya.
              {"\n"}4. Unggah foto laporan sebagai bukti pendukung.
              {"\n"}5. Jelaskan masalah atau keluhan Anda secara rinci.
              {"\n"}6. Periksa kembali informasi yang telah diisi dan klik tombol "Kirim" atau "Submit" untuk mengirim pengaduan.
              {"\n"}7. Pantau status pengaduan Anda melalui aplikasi dan tunggu tanggapan dari instansi terkait.
          
            </Text>
            <TouchableOpacity onPress={handleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  optionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 12,
    marginTop: 5,
    color: 'grey',
  },
  linkText: {
    fontSize: 14,
    marginTop: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
    fontWeight:'500',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A1C7CC',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight:'bold',
  },
});
