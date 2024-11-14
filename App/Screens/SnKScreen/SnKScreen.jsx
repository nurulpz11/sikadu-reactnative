import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../Utils/Color';

export default function SnKScreen() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Syarat dan Ketentuan</Text>
        <Text style={styles.cardContent}>
          Selamat Datang di SIKADU
        </Text>
        <Text style={styles.cardContent}>
          Syarat & ketentuang yang ditetapkan di bawah ini mengatur Pengguna layanan yang disediakan oleh SIKADU, baik berupa informasi, teks, grafik, atau data lain, unduhan, unggahan, atau menggunakan layanan 
          (secara garis besar disebut sebagai data atau konten). Pengguna disarankan membaca dengan seksama karena dapat berdampak kepada hak dan kewajiban Pengguna di bawah hukum
        </Text>
        <Text style={styles.cardContent}>
          Dengan mendaftar dan/atau menggunakan aplikasi SIKADU, maka Pengguna dianggap telah membaca, mengerti, memahami, dan menyetujui semua isi dalam Syarat & Ketentuan.
          Syarat & Ketentuan ini merupakan bentuk kesepakatan yang dituangkan dalam sebuah perjanjian yang sah antara Pengguna dengan aplikasi SIKADU. Jika Pengguna tidak 
          menyetujui salah satu, sebagian, atau seluruh isi Syarat & Ketentuan, maka Pengguna tidak diperkenankan menggunakan layanan aplikasi SIKADU. 
        </Text>
        <Text style={styles.cardContent}>
          Perjanjian ini berlaku sejak tanggal 1 Juni 2023
        </Text>
        <Text style={styles.cardContent}>
          Larangan 
        </Text>
        <Text style={styles.cardContent}>
          Pengguna dapat menggunakan layanan SIKADU hanya untuk tujuan yang sah. Pengguna tidak dapat menggunakan layanan SIKADU dengan cara apa pun yang :
        </Text>
        <Text style={styles.cardContent}>
          1. Melanggar peraturan perundang-undangan yang berlaku di Negara Kesatuan Republik Indonesia
        </Text>
        <Text style={styles.cardContent}>
          2. Melanggar peraturan perundang-undangan yang berlaku di Negara Kesatuan Republik Indonesia
        </Text>
        {/* Checkbox di bagian paling bawah card */}
        <TouchableOpacity onPress={handleCheckboxPress} style={styles.checkboxContainer}>
          {/* Tampilkan centang jika isChecked bernilai true */}
          {isChecked ? (
            <Text style={styles.checkbox}>✅</Text>
          ) : (
            <Text style={styles.checkbox}>☐</Text>
          )}
          {/* Teks penjelasan untuk checkbox */}
          <Text style={styles.checkboxText}>Saya menyetujui Syarat dan Ketentuan di atas</Text>
        </TouchableOpacity>

         
        <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Selanjutnya</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#EEEEEE', 
  },
  card: {
    backgroundColor: '#FFFFFF',  
    borderRadius: 10, 
    padding: 20, 
    width: '90%', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5, 
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'left', 
  },
  cardContent: {
    fontSize: 14,
    textAlign: 'left', 
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row', // Membuat penempatan horizontal untuk komponen checkbox dan teksnya
    alignItems: 'center', // Memusatkan vertikal
  },
  checkbox: {
    fontSize: 30, // Ukuran font checkbox
    marginRight: 10, // Margin kanan untuk jarak antara checkbox dan teks
  },
  checkboxText: {
    fontSize: 14, // Ukuran font teks checkbox
  },
  button: {
    backgroundColor: Colors.HIJAU1,
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
