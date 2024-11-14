import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { profileData } = route.params;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [userData, setUserData] = useState({
    nama_masyarakat: profileData.nama_masyarakat,
    email: profileData.email,
    nik: profileData.nik,
    telp_masyarakat: profileData.telp_masyarakat,
    jenis_kelamin_masyarakat: profileData.jenis_kelamin_masyarakat
      ? (profileData.jenis_kelamin_masyarakat.toLowerCase() === 'perempuan' || profileData.jenis_kelamin_masyarakat.toLowerCase() === 'laki-laki'
        ? capitalizeFirstLetter(profileData.jenis_kelamin_masyarakat.toLowerCase())
        : profileData.jenis_kelamin_masyarakat)
      : '',
    tgl_lahir_masyarakat: profileData.tgl_lahir_masyarakat,
    alamat_masyarakat: profileData.alamat_masyarakat,
  });
  const [password, setPassword] = useState(profileData.kata_sandi_masyarakat || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [genderOptions] = useState(['Perempuan', 'Laki-Laki']);
  const [datePickerVisible, setDatePickerVisible] = useState(false); // State untuk menampilkan date picker
  const [selectedDate, setSelectedDate] = useState(new Date(userData.tgl_lahir_masyarakat)); // State untuk tanggal yang dipilih

  const handleSave = async () => {
    try {
      if (!userData.nama_masyarakat || !userData.email) {
        Alert.alert('Error', 'Nama dan Email harus diisi');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        Alert.alert('Error', 'Email tidak valid');
        return;
      }

      const updatedUserData = {
        ...userData,
        kata_sandi_masyarakat: password,
        tgl_lahir_masyarakat: selectedDate.toISOString().split('T')[0] // Format tanggal sebagai string ISO
      };

      const response = await fetch(`https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/masyarakats/${userData.nik}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      const responseText = await response.text();
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      console.log('Response Text:', responseText);

      if (response.ok) {
        try {
          const updatedData = JSON.parse(responseText);
          console.log('Updated Data:', updatedData);
          Alert.alert('Success', 'Profil berhasil diperbarui');
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Gagal mengurai respons JSON');
        }
      } else {
        console.error('Server Error:', responseText);
        throw new Error(responseText || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Gagal memperbarui profil. Silakan coba lagi.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisible(false); // Menyembunyikan date picker setelah memilih tanggal
    setSelectedDate(currentDate);
    setUserData({ ...userData, tgl_lahir_masyarakat: currentDate.toISOString().split('T')[0] });
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Image
            source={
              profileData.foto_masyarakat
                ? { uri: `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/masyarakat/${profileData.foto_masyarakat}` }
                : require('./../../../assets/images/profile.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Ganti Foto</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Nama</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: userData.nama_masyarakat ? 'black' : 'black' }]}
              value={userData.nama_masyarakat}
              onChangeText={(text) => setUserData({ ...userData, nama_masyarakat: text })}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>NIK</Text>
          <View style={styles.inputContainer}>
            <TextInput
              key={userData.nik}
              style={styles.input}
              value={userData.nik.toString()}
              onChangeText={(text) => setUserData({ ...userData, nik: text })}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>No Handphone</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.telp_masyarakat}
              onChangeText={(text) => setUserData({ ...userData, telp_masyarakat: text })}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Tanggal Lahir</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
              <Image
                source={require('./../../../assets/images/calendar.png')}
                style={styles.calendarIcon}
              />
              <Text style={styles.inputText}>{selectedDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {datePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode='date'
                display='default'
                onChange={onChangeDate}
              />
            )}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
              <Text style={styles.inputText}>{userData.jenis_kelamin_masyarakat || 'Pilih Jenis Kelamin'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Alamat</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userData.alamat_masyarakat}
              onChangeText={(text) => setUserData({ ...userData, alamat_masyarakat: text })}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>

        {/* Modal untuk memilih jenis kelamin */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {genderOptions.map((gender) => (
                <Pressable
                  key={gender}
                  onPress={() => {
                    setUserData({ ...userData, jenis_kelamin_masyarakat: gender });
                    setModalVisible(false);
                  }}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{gender}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>Tutup</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#007AFF',
    marginBottom: -15,
  },
  section: {
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: -8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  inputText: {
    textAlign: 'left',
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalOption: {
    padding: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'left',
  },
  modalCloseButton: {
    marginTop: 1,
    padding: 12,
  },
  modalCloseButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 26,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
