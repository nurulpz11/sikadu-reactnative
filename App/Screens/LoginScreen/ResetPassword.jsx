import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResetPassword = () => {
  const route = useRoute();
  const { token } = route.params; // Ambil token dari parameter route

  // State untuk password baru dan konfirmasi
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Fungsi untuk menangani reset password
  const handleResetPassword = async () => {
    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Password reset successful!');
        // Tambahkan navigasi kembali ke halaman login atau yang sesuai setelah reset berhasil
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <View>
      <Text>Reset Password</Text>
      <TextInput
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm new password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPassword;
