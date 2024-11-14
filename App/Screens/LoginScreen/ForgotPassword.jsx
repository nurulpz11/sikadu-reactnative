import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../Utils/Color';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Harap isi email.');
      return;
    }

    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Permintaan Berhasil', 'Silakan periksa email Anda untuk instruksi lebih lanjut.');
        navigation.navigate('FormLogin');
      } else {
        throw new Error(data.message || 'Permintaan gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Permintaan gagal. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Kata Sandi</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor={Colors.placeholder}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Kirim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FDFDFD',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    marginBottom: 5,
    color: Colors.text,
    fontSize: 16,
  },
  textInput: {
    height: 40,
    borderRadius: 15,
    paddingLeft: 10,
    backgroundColor: '#F2F2F2',
    fontSize: 14
  },
  button: {
    backgroundColor: Colors.HIJAU1,
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
