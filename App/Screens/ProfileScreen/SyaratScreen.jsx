import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'

export default function SyaratScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Syarat & Ketentuan</Text>
      <Text style={styles.subTitle}>Selamat Datang di <Text style={styles.bold}>SIKADU</Text></Text>
      <Text style={styles.paragraph}>
        Syarat & ketentuan yang ditetapkan di bawah ini mengatur Pengguna layanan yang disediakan oleh <Text style={styles.bold}>SIKADU</Text>, baik berupa informasi, teks, grafik, atau data lain, unduhan, unggahan, atau menggunakan layanan (secara garis besar disebut sebagai data atau konten). Pengguna disarankan membaca dengan seksama karena dapat berdampak kepada hak dan kewajiban Pengguna di bawah hukum.
      </Text>
      <Text style={styles.paragraph}>
        Dengan mendaftar dan/atau menggunakan aplikasi <Text style={styles.bold}>SIKADU</Text>, maka Pengguna dianggap telah membaca, mengerti, memahami, dan menyetujui semua isi dalam Syarat & Ketentuan. Syarat & Ketentuan ini merupakan bentuk kesepakatan yang dituangkan dalam sebuah perjanjian yang sah antara Pengguna dengan aplikasi <Text style={styles.bold}>SIKADU</Text>. Jika Pengguna tidak menyetujui salah satu, sebagian, atau seluruh isi Syarat & Ketentuan, maka Pengguna tidak diperkenankan menggunakan layanan di aplikasi <Text style={styles.bold}>SIKADU</Text>.
      </Text>
      <Text style={styles.paragraph}>
        Perjanjian ini berlaku sejak tanggal <Text style={styles.bold}>27 Mei 2024</Text>
      </Text>
      <Text style={styles.paragraph}>
        Kami berhak untuk mengubah Syarat & Ketentuan ini dari waktu ke waktu tanpa pemberitahuan. Pengguna mengakui dan menyetujui bahwa merupakan tanggung jawab Pengguna untuk meninjau Syarat & Ketentuan ini secara berkala untuk mengetahui perubahan apapun. Dengan tetap menggunakan dan menggunakan layanan <Text style={styles.bold}>SIKADU</Text>, maka Pengguna dianggap menyetujui perubahan-perubahan dalam Syarat & Ketentuan.
      </Text>
      <Text style={styles.subTitle}>Larangan</Text>
      <Text style={styles.paragraph}>
        Pengguna dapat menggunakan layanan <Text style={styles.bold}>SIKADU</Text> hanya untuk tujuan yang sah. Pengguna tidak diperbolehkan menggunakan layanan <Text style={styles.bold}>SIKADU</Text> untuk:
      </Text>
      <Text style={styles.bulletPoint}>1. Melanggar peraturan perundang-undangan yang berlaku di Negara Kesatuan Republik Indonesia.</Text>
      <Text style={styles.bulletPoint}>2. Melakukan tindakan yang dapat merugikan orang lain.</Text>
      <Text style={styles.bulletPoint}>3. Menyebarkan konten, data, atau informasi yang mengandung kebohongan, fitnah, atau pelanggaran terhadap hak orang lain.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
})
