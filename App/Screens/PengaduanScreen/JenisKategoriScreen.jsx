import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function JenisKategoriScreen({ navigation }) {
  const route = useRoute();
  const { kategoriId, formScreen } = route.params;
  const [jenisKategori, setJenisKategori] = useState([]);
  
  useEffect(() => {
    axios.get('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/jenisa')
      .then(response => {
        const filteredData = response.data.data.data.filter(item => item.id_kategori === kategoriId);
        setJenisKategori(filteredData);
      })
      .catch(error => {
        console.error(error);
      });
  }, [kategoriId]);

  const navigateToForm = async (idJenisAduan, namaJenisAduan) => {
    try {
      const nik = await AsyncStorage.getItem('nik');
      if (nik) {
        navigation.navigate(formScreen, { idJenisAduan, namaJenisAduan, NIK: nik });
      }
    } catch (error) {
      console.error('Error fetching NIK:', error);
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigateToForm(item.id, item.nama_jenis_aduan)}
      >
        <Image 
          source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/jenis/" + item.foto_jenis_aduan }}
          style={styles.cardImage}
        />
      </TouchableOpacity>
      <Text style={styles.cardText}>{item.nama_jenis_aduan}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jenisKategori}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
        key={kategoriId}
        contentContainerStyle={styles.cardContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  cardContainer: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardWrapper: {
    width: '22%',
    margin: 5,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },
});
