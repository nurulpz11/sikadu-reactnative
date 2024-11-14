import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function TentangScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tentang Aplikasi SIKADU</Text>
      <Image
        source={require('./../../../assets/images/sikadu.png')}
        style={styles.logo}
      />
      <Text style={styles.version}>Versi 1.0.2</Text>
      <Text style={styles.description}>
        SIKADU merupakan Platform Aplikasi yang menyediakan layanan dan informasi, baik yang disediakan oleh Pemerintah maupun oleh Masyarakat.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  version: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
})
