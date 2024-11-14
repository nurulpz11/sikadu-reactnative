import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Color';
import { useNavigation } from '@react-navigation/native';

export default function Onboarding1() {
  const navigation = useNavigation();
  const handleNext = () => {
    navigation.navigate('Register'); // Navigasi ke halaman RegisterScreen
  };

  return (
    <View style={styles.container}>
    <View style={{ alignItems: 'center' }}>
      <View style={styles.logo}>
        <Image source={require('./../../../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.loginImage}>
        <Image source={require('./../../../assets/images/login.png')} style={styles.loginImage} />
        <View style={styles.title1}>
          <Text style={{ fontSize: 27, color: Colors.BLACK, fontWeight: 'bold', textAlign: 'center' }}>
            Selamat Datang di SIKADU
          </Text>
          <Text style={{ fontSize: 18, color: Colors.BLACK, textAlign: 'center', marginTop: 10 }}>
            Mari kita perbaiki Pekanbaru
          </Text>
          <Text style={{ fontSize: 18, color: Colors.BLACK, textAlign: 'center' }}>senang hati!</Text>
        </View>
      </View>

      <View style={styles.bulat}>
        <Image source={require('./../../../assets/images/onbor1.png')} style={styles.bulat} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={{ textAlign: 'center', fontSize: 17, color: Colors.WHITE }}>Selanjutnya</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingTop: 250,
    paddingLeft:60,
    
  },
  loginImage: {
    width: 300,
    height: 300,
    marginBottom: 60,
    resizeMode: 'contain',
  },
  logo: {
    width: 95,
    height: 31,
    marginTop: -80,
    resizeMode: 'contain',
  },
  title1: {
    marginTop: 10,
  },
  bulat: {
    width: 35,
    height: 10,
    marginTop: 70,
  },
  button: {
    padding: 15,
    width: 300,
    height: 50,
    backgroundColor: Colors.HIJAU1,
    borderRadius: 99,
    position: 'absolute',
    bottom: -180,
  },
});
