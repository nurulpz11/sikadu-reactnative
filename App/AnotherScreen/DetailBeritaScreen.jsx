import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function DetailBeritaScreen({ route }) {
  const { berita } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{new Date(berita.tgl_terbit_berita).toLocaleDateString()}</Text>
      <Text style={styles.title}>{berita.judul_berita}</Text>
      <Image
        source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/berita/" + berita.foto_berita }}
        style={styles.image}
      />
      <Text style={styles.desc}>{berita.isi_berita}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingTop: 15,
    padding: 0,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D1D1D6',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: -50,
  },
  desc: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
    marginTop: -40,
    paddingHorizontal: 10,
    textAlign: 'justify',
  }
});
