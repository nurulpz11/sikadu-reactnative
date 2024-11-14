import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import Colors from '../../Utils/Color';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
      },
      headers: {
        'User-Agent': 'sikadu/1.0.0'
      }
    });

    if (response.data && response.data.address) {
      const address = response.data.address;
      const road = address.road || '';
      const neighbourhood = address.neighbourhood || '';
      const cityDistrict = address.city_district || '';
      const city = address.city || '';
      const state = address.state || '';
      const postcode = address.postcode || '';

      // Construct full address
      let fullAddress = `${road}, `;
      if (neighbourhood) fullAddress += `${neighbourhood}, `;
      if (cityDistrict) fullAddress += `${cityDistrict}, `;
      if (city) fullAddress += `Kota ${city}, `;
      if (state) fullAddress += `${state} `;
      if (postcode) fullAddress += `${postcode}`;

      return fullAddress.trim();
    } else {
      throw new Error('Gagal mengambil data alamat');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Gagal mengambil data alamat';
  }
};

export default function RuangKaduScreen() {
  const [dataPengaduan, setDataPengaduan] = useState([]);
  const [dataAspirasi, setDataAspirasi] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('Pengaduan');
  const navigation = useNavigation();

  useEffect(() => {
    fetchDataPengaduan();
    fetchDataAspirasi();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case '0':
        return '#A2CED4'; // Warna abu-abu untuk 'Belum di Proses'
      case 'selesai':
        return '#9FCFA4'; // Warna hijau untuk 'Selesai'
      case 'proses':
        return '#9FAACF'; // Warna kuning untuk 'Proses'
      case 'tolak':
        return '#CC7575'; // Warna merah untuk 'Tolak'
      default:
        return '#FFFFFF'; // Warna default jika status tidak dikenali
    }
  };

  const fetchDataPengaduan = async () => {
    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/pengaduans');
      const text = await response.text();
      const data = JSON.parse(text);
  
      if (data.success) {
        // Process and enhance data with address information
        const updatedData = await Promise.all(data.data.data.map(async (item) => {
          let alamat = 'Lokasi tidak tersedia';
  
          if (item.lokasi_pengaduan) {
            const [latitude, longitude] = item.lokasi_pengaduan.split(',').map(coord => parseFloat(coord));
            if (!isNaN(latitude) && !isNaN(longitude)) {
              alamat = await reverseGeocode(latitude, longitude);
            }
          }
  
          return { ...item, alamat };
        }));
        
        setDataPengaduan(updatedData);
      } else {
        Alert.alert('Gagal mengambil data', data.message);
      }
    } catch (error) {
      Alert.alert('Gagal mengambil data', error.message);
    }
  };

  const fetchDataAspirasi = async () => {
    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/aspirasis');
      const text = await response.text();
      const data = JSON.parse(text);

      if (data.success) {
        setDataAspirasi(data.data.data);
      } else {
        Alert.alert('Gagal mengambil data', data.message);
      }
    } catch (error) {
      Alert.alert('Gagal mengambil data', error.message);
    }
  };

  const navigateToDetailRuangKadu = (item) => {
    navigation.navigate('Detail Ruang Kadu', { item }); // Kirim data item ke halaman detail
  };

  const filteredData = dataPengaduan.filter(item => 
    item.permasalahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jenis.nama_jenis_aduan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi_pengaduan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAspirasi = dataAspirasi.filter(item => 
    item.judul_aspirasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jenis.nama_jenis_aduan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePress = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Pengaduan' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Pengaduan')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Pengaduan' && styles.selectedButtonText,
            ]}
          >
            Pengaduan
          </Text>
          {selectedMenu === 'Pengaduan' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Aspirasi' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Aspirasi')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Aspirasi' && styles.selectedButtonText,
            ]}
          >
            Aspirasi
          </Text>
          {selectedMenu === 'Aspirasi' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Cari..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedMenu === 'Pengaduan' ? (
          filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigateToDetailRuangKadu(item)}>
                <Image
                  source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/pengaduan/" + item.foto_pengaduan }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.jenisContainer}>
                    <Text style={styles.jenisText}>{item.jenis.nama_jenis_aduan}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.permasalahan}</Text>
                  <Text style={styles.alamatText}>{item.alamat}</Text>
                  <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status_pengaduan) }]}>
                    <Text style={styles.statusText}>
                      {item.status_pengaduan === '0' ? 'Belum di Proses' : capitalizeFirstLetter(item.status_pengaduan)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>Tidak ada data pengaduan</Text>
          )
        ) : selectedMenu === 'Aspirasi' ? (
          filteredAspirasi.length > 0 ? (
            filteredAspirasi.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.judul_aspirasi}</Text>
                  <Text style={styles.cardText}>Jenis Kategori: {item.jenis.nama_jenis_aduan}</Text>
                  <Text style={styles.cardText}>Tanggal aspirasi: {item.tgl_aspirasi}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Tidak ada data aspirasi</Text>
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    marginTop:-8,
    alignSelf: 'left',
    marginLeft: 10,
  },
  sliderButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  selectedButton: {
    borderBottomColor: 'transparent',
  },
  sliderButtonText: {
    fontSize: 16,
    color: 'black',
  },
  selectedButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  sliderIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '25%',
    right: '25%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#008080',
  },
  searchBar: {
    backgroundColor: '#F2F2F2',
    width: '92%',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'black',
    marginBottom: 10
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    width: 380,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 17,
    position: 'relative',
  },
  cardImage: {
    width: 150,
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    marginLeft: -150,
    width: 150,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8, 
    textAlign: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  jenisContainer: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    marginTop:-6,
    alignSelf: 'flex-start',
  },
  jenisText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    fontFamily:'poppins',
  },
  alamatText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 5,
    color: 'white',
  },
  button: {
    backgroundColor: Colors.HIJAU1,
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFF',
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    color: '#grey',
    textAlign: 'center',
    marginTop: 20,
  },
});
