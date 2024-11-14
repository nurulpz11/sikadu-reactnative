import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../../Utils/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function FormLogin() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!nik || !password) {
      Alert.alert('Gagal', 'Harap isi NIK dan kata sandi.');
      return;
    }

    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nik: nik,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('nik', nik);
        console.log('Stored NIK:', nik);
        Alert.alert('Login berhasil!', 'Selamat datang kembali!');
        navigation.navigate('Main');
      } else {
        throw new Error(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Login gagal. Silakan coba lagi.');
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('Lupa Password');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <View style={styles.logo}>
          <Image source={require('./../../../assets/images/formlogin.png')} style={styles.headImage} />
        </View>

        <View style={styles.loginImageContainer}>
          <Image source={require('./../../../assets/images/logo.png')} style={styles.loginImage} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>Selamat datang di SIKADU</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>NIK</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan NIK"
              placeholderTextColor={Colors.placeholder}
              value={nik}
              onChangeText={(text) => setNik(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={16}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Kata Sandi</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.textInput2}
                placeholder="Masukkan Kata Sandi"
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image
                  source={
                    passwordVisible
                      ? require('./../../../assets/images/eye3.png')
                      : require('./../../../assets/images/eye.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.loginText, styles.forgotPasswordText]}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>

          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={handleNavigateToRegister}>
              <Text style={[styles.loginText, styles.loginTextBlue]}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: '#FDFDFD',
    borderRadius: 20,
    padding: 20,
    marginTop: 50,
    width: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
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
    flex: 1,
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
    color: '#125BC7',
  },
  forgotPasswordText: {
    color: '#125BC7',
    textAlign: 'right',
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '500',
    marginTop: -7,
  },
});
