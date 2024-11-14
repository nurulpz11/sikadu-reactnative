import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import Stars from 'react-native-stars';
import { FontAwesome } from '@expo/vector-icons';

const TimelineItem = ({ status, isi, tanggal, fotoTanggapan, isFirst, isCompleted, isLast, onViewPhoto }) => (
  <View style={styles.timelineItem}>
    {!isFirst && <View style={styles.timelineLine} />}
    <View
      style={[
        styles.timelineDot,
        isFirst ? styles.timelineDotFirst : styles.timelineDotDefault,
        isCompleted && styles.timelineDotCompleted,
      ]}
    />
    <View style={styles.timelineItemContent}>
      <Text style={styles.statusTanggapan}>{status}</Text>
      <Text style={styles.statusIsi}>{isi}</Text>
      <Text style={styles.statusDate}>{tanggal}</Text>
      {fotoTanggapan && (
        <TouchableOpacity onPress={() => onViewPhoto(fotoTanggapan)}>
          <Text style={styles.tanggapanFoto}>Lihat Foto Tanggapan</Text>
        </TouchableOpacity>
      )}
    </View>
    {!isLast && <View style={styles.timelineLine} />}
  </View>
);

export default function DetailRuangKaduScreen() {
  const route = useRoute();
  const { item } = route.params;
  const [rating, setRating] = useState(null);
  const [logTanggapans, setLogTanggapans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestTanggapan, setLatestTanggapan] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (item.status_pengaduan === 'selesai') {
          const response = await axios.get(`https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/ratings?id_pengaduan=${item.id}`);
          const ratings = response.data.data.data;
          const filteredRatings = ratings.filter(r => r.id_pengaduan === item.id);
          if (filteredRatings.length > 0) {
            setRating(filteredRatings[filteredRatings.length - 1]);
          }
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    const fetchLogTanggapans = async () => {
      try {
        const url = `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/logTanggapans?id_pengaduan=${item.id}`;
        const response = await fetch(url);
        const data = await response.json();
        const filteredData = data.data.data
          .filter(log => log.id_pengaduan === item.id)
          .sort((a, b) => new Date(b.tgl_tanggapan) - new Date(a.tgl_tanggapan));
        setLogTanggapans(filteredData);
      } catch (error) {
        console.error('Error fetching log tanggapan:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLatestTanggapan = async () => {
      try {
        const urlTanggapan = `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/tanggapans?id_pengaduan=${item.id}`;
        const response = await fetch(urlTanggapan);
        const data = await response.json();
        const latest = data.data.data.find(tanggapan => tanggapan.id_pengaduan === item.id);
        setLatestTanggapan(latest);
      } catch (error) {
        setError('Error fetching latest tanggapan: ' + error.message);
      }
    };

    fetchRatings();
    fetchLogTanggapans();
    fetchLatestTanggapan();
  }, [item.id, item.status_pengaduan]);

  const handleViewPhoto = (url) => {
    setPhotoUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPhotoUrl('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/pengaduan/${item.foto_pengaduan}` }}
        style={styles.Image}
      />
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>{item.permasalahan}</Text>
            <View style={styles.idContainer}>
              <Text style={styles.titleId}>ID:PG00</Text>
              <Text style={styles.textShadowRadius}>{item.id}</Text>
            </View>
          </View>
          <View style={styles.jenisContainer}>
            <Text style={styles.jenisLabel}>Detail Permasalahan:</Text>
            <Text style={styles.jenisValue}>{item.keterangan}</Text>
          </View>
          <View style={styles.jenisContainer}>
            <Text style={styles.jenisLabel}>Jenis Kategori:</Text>
            <Text style={styles.jenisValue}>{item.jenis.nama_jenis_aduan}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require('./../../../assets/images/location1.png')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>{item.alamat}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={require('./../../../assets/images/date2.png')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>{item.tgl_pengaduan}</Text>
          </View>
          <Text style={styles.title}>Status Tanggapan: </Text>
          {latestTanggapan ? (
    <View style={styles.timeline}>
      <View style={styles.timelineLine} />
      <View style={styles.timelineItem}>
        <View style={[styles.timelineDot, styles.timelineDotFirst]} />
        <View style={styles.timelineItemContent}>
          <Text style={styles.statusTanggapan}>{latestTanggapan.status_tanggapan}</Text>
          <Text style={styles.statusIsi}>{latestTanggapan.isi_tanggapan}</Text>
          <Text style={styles.statusDate}>{latestTanggapan.tgl_tanggapan}</Text>
          {latestTanggapan.foto_tanggapan && (
            <TouchableOpacity onPress={() => handleViewPhoto(latestTanggapan.foto_tanggapan)}>
              <Text style={styles.tanggapanFoto}>Lihat Foto Tanggapan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
              {logTanggapans.map((log, index) => (
                <TimelineItem
                  key={index}
                  status={log.status_tanggapan === '0' ? 'Belum di Proses' : log.status_tanggapan}
                  isi={log.isi_tanggapan}
                  tanggal={log.tgl_tanggapan}
                  fotoTanggapan={log.foto_tanggapan}
                  onViewPhoto={handleViewPhoto}
                  isFirst={false}
                  isLast={index === logTanggapans.length - 1}
                  isCompleted={log.status_tanggapan !== '0'}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.noStatusText}>Menunggu laporan di proses</Text>
          )}
        </View>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {photoUrl ? (
              <>
                <Image
                  source={{ uri: `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/tanggapan/${photoUrl}` }}
                  style={styles.modalImage}
                />
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Tutup</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    width: '100%',
    height: '65%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  Image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  idContainer: {
    flexDirection: 'row',
    marginRight: 20,
  },
  jenisText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 15,
  },
  descText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '300',
    marginBottom: 5,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '300',
    marginBottom: 5,
    marginLeft: 7,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 13,
    marginTop: 3,
  },
  logo: {
    width: 15, // Atur lebar logo
    height: 15, // Atur tinggi logo
    resizeMode: 'contain', // Atur agar logo tidak terpotong
    marginLeft: -14,
  },
  jenisContainer: {
    marginBottom: 15,
  },
  jenisLabel: {
    fontSize: 15,
    color: '#000000',
  },
  jenisValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '300',
    marginTop: 5, // Menambahkan jarak antara label dan nilai
  },
  ratingContainer: {
    marginTop: 15,
  },
  ratingContent: {
    flexDirection: 'row', // Ensure rating text and stars are in a row
    alignItems: 'center', // Align items vertically in the center
  },
  ratingValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '300',
    marginTop: 5, // Menambahkan jarak antara label dan nilai
  },
  myStarStyle: {
    color: 'gold',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
  logContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logItem: {
    marginBottom: 10,
  },
  logDate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  logMessage: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '300',
  },
  timeline: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
 timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 1,
    top: 2,
    zIndex: 1, // Menambahkan zIndex untuk memastikan titik berada di atas garis
  },
  timelineDotFirst: {
    backgroundColor: '#28a745',
  },
  timelineDotDefault: {
    backgroundColor: '#007bff',
  },
  timelineDotCompleted: {
    backgroundColor: '#888',
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 12,
    bottom: 0,
    width: 2,
    backgroundColor: '#888888',
  },
  timelineItemContent: {
    marginLeft: 20,
    flex: 1,
  },
  statusTanggapan: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusIsi: {
    fontSize: 14,
    color: '#666666',
  },
  statusDate: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  tanggapanFoto: {
    fontSize: 14,
    marginBottom: 5,
    color: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#008080',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noStatusText: {
    fontSize: 14,
    color: '#888888',
    marginTop: 10,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
    marginTop:6,
  },
});
