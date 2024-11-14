import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function KategoriScreen() {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { reportType, formScreen } = route.params;

  useEffect(() => {
    axios.get('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/kategoris')
      .then(response => {
        setCategories(response.data.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Jenis Kategori', { kategoriId: item.id, reportType, formScreen })}>
        <Image source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/kategori/" + item.foto_kategori }} style={styles.cardImage} />
      </TouchableOpacity>
      <Text style={styles.cardText}>{item.nama_kategori}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pilih kategori berdasarkan laporan kamu"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        key={4}
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
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
  searchBar: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'black',
    marginTop: 20,
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
