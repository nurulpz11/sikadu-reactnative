import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, TextInput, Button, Alert } from 'react-native';

import { useRoute } from '@react-navigation/native';

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

export default function DetailAktivitasScreen() {
  const route = useRoute();
  const { pengaduan } = route.params;
  const [kategoriList, setKategoriList] = useState([]);
  const [logTanggapanList, setLogTanggapanList] = useState([]);
  const [error, setError] = useState(null);
  const [latestTanggapan, setLatestTanggapan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [rating, setRating] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    // Fetch Kategori List
    fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/kategoris')
      .then(response => response.json())
      .then(data => setKategoriList(data.data.data))
      .catch(error => setError('Error fetching kategori: ' + error.message));

    // Fetch Log Tanggapan List
    const url = `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/logTanggapans?id_pengaduan=${pengaduan.id}`;
    console.log('Fetching log tanggapan from URL:', url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Log Tanggapan Data:', data.data.data);
        const filteredData = data.data.data
          .filter(log => log.id_pengaduan === pengaduan.id)
          .sort((a, b) => new Date(b.tgl_tanggapan) - new Date(a.tgl_tanggapan));
        setLogTanggapanList(filteredData);
      })
      .catch(error => {
        setError('Error fetching log tanggapan: ' + error.message);
        console.error('Error details:', error.message);
      });

    // Fetch the latest tanggapan
    const urlTanggapan = `https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/tanggapans?id_pengaduan=${pengaduan.id}`;
    fetch(urlTanggapan)
      .then(response => response.json())
      .then(data => {
        const latest = data.data.data.find(tanggapan => tanggapan.id_pengaduan === pengaduan.id);
        setLatestTanggapan(latest);
      })
      .catch(error => setError('Error fetching latest tanggapan: ' + error.message));
  }, [pengaduan.id]);

  const kategori = kategoriList.find(k => k.id === pengaduan.jenis.id_kategori);

  const handleViewPhoto = (url) => {
    setPhotoUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPhotoUrl('');
  };

  const openRatingModal = () => {
    fetch(`https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/ratings?id_pengaduan=${pengaduan.id}`)
      .then(response => response.json())
      .then(data => {
        const ratings = data.data.data.filter(r => r.id_pengaduan === pengaduan.id);
        if (ratings.length > 0) {
          // Mengambil rating terbaru berdasarkan id terbesar
          const latestRating = ratings.reduce((latest, current) => (current.id > latest.id ? current : latest), ratings[0]);
          setRatingMessage(latestRating.pesan);
          setSelectedRating(latestRating.nilai);
        } else {
          setRatingMessage('');
          setSelectedRating(0);
        }
        setModalVisible(true);
      })
      .catch(error => setError('Error fetching rating: ' + error.message));
  };
  
  
  const handleRatingSubmit = () => {
    fetch(`https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_pengaduan: pengaduan.id,
        nilai: selectedRating,
        pesan: ratingMessage,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Rating submitted:', data);
        // Tampilkan alert setelah berhasil
        Alert.alert('Success', 'Rating berhasil dikirim!', [{ text: 'OK', onPress: () => closeModal() }]);
        // Fetch the latest rating data to ensure the UI updates
        openRatingModal(); // Refresh the modal with updated data
      })
      .catch(error => {
        setError('Error submitting rating: ' + error.message);
        console.error('Error details:', error.message);
      });
  };
  
  

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
        <Text style={selectedRating >= star ? styles.starSelected : styles.star}>★</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/pengaduan/" + pengaduan.foto_pengaduan }}
          style={styles.image}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Permasalahan:</Text>
          <Text style={styles.description}>{pengaduan.permasalahan}</Text>
          <Text style={styles.title}>Keterangan:</Text>
          <Text style={styles.description}>{pengaduan.keterangan}</Text>
          <Text style={styles.title}>Lokasi:</Text>
          <Text style={styles.description}>{pengaduan.alamat}</Text>
        </View>
        <View style={styles.dateSection}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>Pengaduan Masuk</Text>
          <Text style={styles.date}>{pengaduan.tgl_pengaduan}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>Pengaduan Selesai</Text>
          <Text style={styles.date}>
            {latestTanggapan && latestTanggapan.status_tanggapan === 'selesai' ? latestTanggapan.tgl_tanggapan : pengaduan.tgl_selesai}
          </Text>
        </View>
      </View>

      </View>
      <View style={styles.card}>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>Detail Pengaduan</Text>
          <Text style={styles.description}>Nomor Pengaduan: {pengaduan.id}</Text>
          <Text style={styles.description}>Jenis aduan: {pengaduan.jenis.nama_jenis_aduan}</Text>
          <Text style={styles.description}>Kategori Pengaduan: {kategori ? kategori.nama_kategori : 'Loading...'}</Text>
        </View>
        <View style={styles.statusContainer}>
  <Text style={styles.title}>Status Tanggapan</Text>
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
      {logTanggapanList.length > 0 ? (
        logTanggapanList.map((log, index) => (
          <TimelineItem
            key={index}
            status={log.status_tanggapan === '0' ? 'Belum di Proses' : log.status_tanggapan}
            isi={log.isi_tanggapan}
            tanggal={log.tgl_tanggapan}
            fotoTanggapan={log.foto_tanggapan}
            onViewPhoto={handleViewPhoto}
            isFirst={index === 0}
            isLast={index === logTanggapanList.length - 1}
            isCompleted={log.status_tanggapan !== '0'}
          />
        ))
      ) : (
        <Text style={styles.noStatusText}></Text>
      )}
    </View>
  ) : (
    <Text style={styles.noStatusText}>Menunggu laporan di proses</Text>
  )}
</View>

    </View>
    {latestTanggapan && latestTanggapan.status_tanggapan === 'selesai' && (
      <View style={styles.card}>
        <TouchableOpacity onPress={openRatingModal} style={styles.ratingButton}>
          <Text style={styles.ratingButtonText}>Berikan Penilaian</Text>
        </TouchableOpacity>
      </View>
    )}
   <Modal visible={modalVisible} transparent={true} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {photoUrl ? (
        <>
          <Image source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/tanggapan/" + photoUrl }} style={styles.modalImage} />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.ratingTitle}>Berikan Penilaian</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <TextInput
            style={styles.ratingInput}
            placeholder="Masukkan pesan"
            value={ratingMessage}
            onChangeText={setRatingMessage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRatingSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  </View>
</Modal>


  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
    marginTop: -10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 415,
    height: 250,
    borderRadius: 1,
  },
  infoContainer: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  tanggapanFoto: {
    fontSize: 14,
    marginBottom: 8,
    color: '#007bff',
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  dateTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  detailContainer: {
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 10,
  },
  timeline: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    marginLeft: 12,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#ddd',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 16,
    position: 'relative',
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
  timelineItemContent: {
    marginLeft: 16,
    flex: 1,
  },
  statusTanggapan: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  statusIsi: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 12,
    color: '#888',
  },
  noStatusText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'left',
    fontWeight:'500',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  
  ratingContainer1: {
    marginTop: 20,
    alignItems: 'center',
  },
  ratingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '80%',
    textAlign: 'center',
  },
  ratingButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom:20,
  },
  ratingButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    fontSize: 32,
    color: '#ddd',
  },
  starSelected: {
    fontSize: 32,
    color: '#ffd700',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#A8D3D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize:14,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  
});
