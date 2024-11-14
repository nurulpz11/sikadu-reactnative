import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Colors from '../Utils/Color';

export default function PemadamanScreen() {
  const [selectedMenu, setSelectedMenu] = useState('Semua');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePress = (menu) => {
    setSelectedMenu(menu);
    filterData(menu);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/pemadamans');
      console.log('Response API:', response.data);
      setData(response.data.data.data);
      setFilteredData(response.data.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterData = (status) => {
    if (status === 'Semua') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.status_pemadaman === status);
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => {
    console.log('Item:', item);
    const buttonColor = () => {
      switch (item.status_pemadaman) {
        case 'Berlangsung':
          return '#9FCFA4';
        case 'Mendatang':
          return '#9FAACF';
        case 'Selesai':
          return '#CC7575';
        default:
          return Colors.HIJAU1;
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardThirdContent}>
          <View style={styles.textContainerColumn}>
            <Text style={styles.titleCard}>{item.judul_pemadaman}</Text>
            <Text style={styles.addressText}>{item.lokasi_pemadaman}</Text>
            <Text style={styles.dateText}>{item.tgl_mulai_pemadaman}</Text>
            <Text style={styles.timeText}>{`${item.jam_mulai_pemadaman} - ${item.jam_selesai_pemadaman}`}</Text>
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor() }]}>
            <Text style={styles.buttonText}>{item.status_pemadaman}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Semua' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Semua')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Semua' && styles.selectedButtonText,
            ]}
          >
            Semua
          </Text>
          {selectedMenu === 'Semua' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Berlangsung' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Berlangsung')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Berlangsung' && styles.selectedButtonText,
            ]}
          >
            Berlangsung
          </Text>
          {selectedMenu === 'Berlangsung' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Mendatang' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Mendatang')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Mendatang' && styles.selectedButtonText,
            ]}
          >
            Mendatang
          </Text>
          {selectedMenu === 'Mendatang' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sliderButton,
            selectedMenu === 'Selesai' && styles.selectedButton,
          ]}
          onPress={() => handlePress('Selesai')}
        >
          <Text
            style={[
              styles.sliderButtonText,
              selectedMenu === 'Selesai' && styles.selectedButtonText,
            ]}
          >
            Selesai
          </Text>
          {selectedMenu === 'Selesai' && <View style={styles.sliderIndicator} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 20,
    alignSelf: 'center',
    marginLeft:-10
  },
  sliderButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  selectedButton: {
    borderBottomColor: '#FFFFFF',
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
  card: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    padding: 15,
  },
  cardThirdContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainerColumn: {
    flex: 1,
  },
  titleCard: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    marginTop: 7,
    fontSize: 14,
    color: 'black',
    fontWeight: '400',
  },
  addressText: {
    marginTop: 5,
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  timeText: {
    marginTop: 7,
    fontSize: 12,
    color: 'black',
    fontWeight: '300',
  },
  button: {
    padding: 6,
    borderRadius: 8,
    width: 86,
    height: 26,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight:'500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
});
