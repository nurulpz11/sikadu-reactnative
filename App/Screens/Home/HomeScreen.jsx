import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert,Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import Colors from '../../Utils/Color';
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

    console.log('Reverse geocoding response:', response.data);

    if (response.data && response.data.address) {
      const address = response.data.address;
      const road = address.road || '';
      const neighbourhood = address.neighbourhood ||'';
      const cityDistrict = address.city_district || '';

      let fullAddress = `${road}`;
      if (neighbourhood) fullAddress += `,${neighbourhood}`;
      if (cityDistrict) fullAddress += `,${cityDistrict}`;

      return fullAddress.trim();
    } else {
      throw new Error('Gagal mengambil data alamat');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Gagal mengambil data alamat';
  }
};

const StatusLaporanCard = ({ statusCounts }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false },
    )(event);
  };

  const translateY = scrollY.interpolate({
    inputRange: [0, 120], // Sesuaikan range ini dengan tinggi konten
    outputRange: [0, 40], // Sesuaikan ini dengan jarak per item
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.statusLaporanContainer}>
      <Text style={styles.statusLaporanTitle}>Status Laporan Anda</Text>
      <View style={styles.statusLaporanCard}>
        <View style={styles.indicatorContainer}>
          <Animated.View style={[styles.scrollIndicator, { transform: [{ translateY }] }]} />
        </View>
        <ScrollView
          style={styles.scrollableLeftSection}
          nestedScrollEnabled={true}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {Object.keys(statusCounts).map((key) => (
            <TouchableOpacity key={key} style={styles.leftSection} activeOpacity={0.8}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(key) }]}></View>
              <Text style={styles.statusText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={styles.countText}> : {statusCounts[key]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.rightSection}>
          <Text style={styles.totalText}>TOTAL</Text>
          <Text style={styles.totalCount}>
            {Object.values(statusCounts).reduce((acc, count) => acc + count, 0)}
          </Text>
          <Text style={styles.summaryText}>Pengaduan</Text>
        </View>
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'menunggu':
      return '#FF9800';
    case 'proses':
      return '#4CAF50';
    case 'selesai':
      return '#2196F3';
    default:
      return '#9E9E9E';
  }
};

export default function HomeScreen() {
  const [dataPengaduan, setDataPengaduan] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ menunggu: 0, proses: 0, selesai: 0, tolak: 0 });
  const [showLiveChat, setShowLiveChat] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDataPengaduan();
  }, []);

  const fetchDataPengaduan = async () => {
    try {
      const nik = await AsyncStorage.getItem('nik');  
      
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/pengaduans');
      const json = await response.json();
      if (json.success) {
        const allData = [];
  
        for (const item of json.data.data) {
          let alamat = 'Lokasi tidak tersedia';
  
          if (item.lokasi_pengaduan) {
            const [latitude, longitude] = item.lokasi_pengaduan.split(',').map(coord => parseFloat(coord));
            if (!isNaN(latitude) && !isNaN(longitude)) {
              alamat = await reverseGeocode(latitude, longitude);
            }
          }
  
          allData.push({ ...item, alamat });
  
          // Jeda 500ms sebelum melanjutkan ke item berikutnya
          await new Promise(resolve => setTimeout(resolve, 500));
        }
  
        setDataPengaduan(allData);
        const filteredData = allData.filter(item => item.nik === nik); // Filter only for status counts
        calculateStatusCounts(filteredData);
      } else {
        Alert.alert('Gagal mengambil data', json.message);
      }
    } catch (error) {
      Alert.alert('Gagal mengambil data', error.message);
    }
  };

  const calculateStatusCounts = (pengaduanData) => {
    const counts = {
      menunggu: 0,
      proses: 0,
      selesai: 0,
      tolak: 0,
    };
  
    pengaduanData.forEach(item => {
      const status = item.status_pengaduan.toLowerCase();
      if (status === '0') {
        counts['menunggu']++;
      } else if (counts.hasOwnProperty(status)) {
        counts[status]++;
      } else {
        counts['tolak']++;
      }
    });
  
    setStatusCounts(counts);
  };
  

  const navigateToRuangKadu = () => {
    navigation.navigate('Ruang Kadu');
  };
  const navigateToLayanan = () => {
    navigation.navigate('Layanan');
  };
  const navigateToBerita = () => {
    navigation.navigate('Berita');
  };
  const navigateToKontak = () => {
    navigation.navigate('Kontak');
  };
  const navigateToPemadaman = () => {
    navigation.navigate('Pemadaman');
  };
  const navigateToFaq = () => {
    navigation.navigate('FAQ');
  };

  const latestPengaduan = dataPengaduan
    .sort((a, b) => new Date(b.tgl_pengaduan) - new Date(a.tgl_pengaduan))
    .slice(0, 3); // Get the latest 3 pengaduans

  return (
    <View style={styles.container}>
      <View style={styles.fixedContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={require('./../../../assets/images/posterpku.png')}
            style={styles.posterImage}
          />
        </View>

       
        <View style={styles.cardSecondary}>
          <View style={styles.row}>
            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToRuangKadu}>
                <Image
                  source={require('./../../../assets/images/complain2.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>Ruang Kadu</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToBerita}>
                <Image
                  source={require('./../../../assets/images/news2.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>Berita</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToPemadaman}>
                <Image
                  source={require('./../../../assets/images/listrik.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>Pemadaman</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToLayanan}>
                <Image
                  source={require('./../../../assets/images/layanan1.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>Layanan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToKontak}>
                <Image
                  source={require('./../../../assets/images/phone5.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>Kontak</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardSecondaryItem}>
              <TouchableOpacity onPress={navigateToFaq}>
                <Image
                  source={require('./../../../assets/images/faq3.png')}
                  style={styles.imageSecondary}
                />
                <Text style={styles.textBelowImage}>FAQ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <StatusLaporanCard statusCounts={statusCounts} />

        <Text style={styles.title}>Pengaduan Masyarakat Terbaru</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {latestPengaduan.length > 0 ? (
          latestPengaduan.map((item) => (
            <View key={item.id} style={styles.cardThird}>
              <View style={styles.cardThirdContent}>
                <Image
                  source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/pengaduan/" + item.foto_pengaduan }}
                  style={styles.thirdImage}
                />
                <View style={styles.textContainerColumn}>
                  <Text style={styles.permasalahanText}>{item.permasalahan}</Text>
                  <Text style={styles.jenisText}>{item.jenis.nama_jenis_aduan}</Text>
                  <Text style={styles.alamatText}>{item.alamat}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.tgl_pengaduan).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>

                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Loading..</Text>
        )}
      </ScrollView>

    {/* WebView untuk live chat */}
    {showLiveChat && (
        <View style={styles.webViewContainer}>
          <WebView
            style={styles.webView}
            source={{
              uri: `https://go.crisp.chat/chat/embed/?website_id=6ba5807b-56db-440a-b9b7-86559d056576`,
            }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowLiveChat(false)}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tombol live chat */}
      <TouchableOpacity 
        style={styles.liveChatButtonContainer} 
        onPress={() => setShowLiveChat(!showLiveChat)}
      >
        <Image
          source={require('./../../../assets/images/livechat.png')}
          style={styles.liveChatLogo}
        />
      </TouchableOpacity>
    </View>
  
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fixedContainer: {
    backgroundColor: 'white',
  },
  posterContainer: {
    width: '100%',
    height: 250,
    marginBottom: 13,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusLaporanContainer: {
    marginBottom: 20,
  },
  statusLaporanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  statusLaporanCard: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
  },
  scrollableLeftSection: {
    flex: 1,
    marginRight: 6,
    maxHeight: 72, // Sesuaikan tinggi maksimal untuk scroll
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    height: 45, // Sesuaikan tinggi untuk paging
    width: 190,
    marginBottom: 7, // Tambahkan marginBottom agar ada jarak antar section
  },
  indicatorContainer: {
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scrollIndicator: {
    width: 8,
    height: 20, // Tinggi indikator
    backgroundColor: '#359FAD',
    borderRadius: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#359FAD',
    borderRadius: 8,
    padding: 12,
    width: 120,
    height: 80,
  },
  totalText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalCount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  summaryText: {
    color: 'white',
    fontSize: 12,
  },
  cardSecondary: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    padding: 10,
    paddingHorizontal: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardSecondaryItem: {
    width: '30%',
    height: 70,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFF',
    borderWidth: 1,
  },
  imageSecondary: {
    width: 44,
    height: 34,
    resizeMode: 'contain',
  },
  textBelowImage: {
    marginTop: 5,
    fontSize: 13,
    color: '#747474',
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: -8,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    flex: 1,
  },
  cardThird: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 15,
  },
  cardThirdContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thirdImage: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textContainerColumn: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  permasalahanText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
    marginTop:-15,
  },
  jenisText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
    fontWeight: '400',
  },
  alamatText: {
    marginTop: 5,
    fontSize: 13,
    color: '#7E7E7E',
    marginRight:138,
    fontWeight: '500',
  
  },
  dateText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
  liveChatButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    zIndex: 1000,
  },
  liveChatLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'white',
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
