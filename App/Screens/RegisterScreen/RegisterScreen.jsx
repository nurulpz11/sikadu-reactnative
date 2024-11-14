import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../Utils/Color';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telp, setTelp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State untuk mengelola visibilitas kata sandi
  const [foto, setFoto] = useState(null);
  
  const navigation = useNavigation();
  
  const handleLoginNavigation = () => {
    navigation.navigate('FormLogin'); // Navigasi ke halaman FormLogin
  };

  const handleRegister = () => {
    if (!nik || !nama || !email || !telp || !password) {
      Alert.alert('Registrasi Gagal', 'Lengkapi data anda');
      return;
    }
  
    const data = new FormData();
    data.append('nik', nik);
    data.append('nama_masyarakat', nama);
    data.append('email', email);
    data.append('telp_masyarakat', telp);
    data.append('kata_sandi_masyarakat', password);
  
    if (foto) {
      data.append('foto_masyarakat', {
        uri: foto.uri,
        type: foto.type,
        name: foto.fileName,
      });
    }
  
    fetch('https://4b1d-2001-448a-1082-bd03-5025-dceb-6a8-69d9.ngrok-free.app/api/masyarakats', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => {
        console.log('Response Status:', response.status);
        if (response.status === 201) { // Status code 201 untuk Created
          return response.json();
        } else {
          return response.text().then(text => { throw new Error(text) });
        }
      })
      .then(responseJson => {
        console.log('Response JSON:', responseJson);
        if (responseJson && responseJson.message === 'Data Masyarakat Berhasil Ditambahkan!') {
          Alert.alert('Success', responseJson.message);
          navigation.navigate('FormLogin'); 
        } else {
          Alert.alert('Gagal', 'Registration failed. Please check your inputs.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Gagal', `An error occurred: ${error.message}`);
      });
  };
  

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.logo}>
        <Image
          source={require('./../../../assets/images/formlogin.png')}
          style={styles.headImage}
        />
      </View>

      <View style={styles.loginImageContainer}>
        <Image
          source={require('./../../../assets/images/logo.png')}
          style={styles.loginImage}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Selamat datang di SIKADU</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>NIK</Text>
          <TextInput
            style={styles.textInput}
            placeholder="NIK"
            value={nik}
            onChangeText={(text) => {
              const filteredText = text.replace(/[^0-9]/g, ''); // Hanya angka yang diperbolehkan
              if (filteredText.length <= 16) { // Maksimal 16 angka
                setNik(filteredText);
              }
            }}
            placeholderTextColor={Colors.placeholder}
            keyboardType="numeric"
            maxLength={16}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Nama Pengguna</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nama Pengguna"
            value={nama}
            onChangeText={setNama}
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>No. Handphone</Text>
          <TextInput
            style={styles.textInput}
            placeholder="No. Handphone"
            value={telp}
            onChangeText={(text) => {
              const filteredText = text.replace(/[^0-9]/g, ''); // Hanya angka yang diperbolehkan
              if (filteredText.length <= 13) { // Maksimal 13 angka
                setTelp(filteredText);
              }
            }}
            placeholderTextColor={Colors.placeholder}
            keyboardType="numeric"
            maxLength={16}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Kata Sandi</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.textInput2}
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible} // Mengubah visibilitas kata sandi berdasarkan state
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Image
                source={
                  passwordVisible
                    ? require('./../../../assets/images/eye3.png') // Gambar mata terbuka
                    : require('./../../../assets/images/eye.png') // Gambar mata tertutup
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>

        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={handleLoginNavigation}>
            <Text style={[styles.loginText, styles.loginTextBlue]}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginImageContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  loginImage: {
    width: 100,
    height: 32,
  },
  headImage: {
    width: 420,
    height: 200,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    marginTop: 20,
    width: '88%',
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
    // Shadow properties for Android
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    marginBottom: 5,
    color: Colors.text,
  },
  textInput: {
    height: 40,
    borderRadius: 15,
    paddingLeft: 10,
    backgroundColor: '#F2F2F2',
  },
  textInput2: {
    height: 40,
    borderRadius: 15,
    paddingLeft: 1,
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    paddingLeft: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
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
  loginTextContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  loginTextBlue: {
    color: 'blue',
  },
});
