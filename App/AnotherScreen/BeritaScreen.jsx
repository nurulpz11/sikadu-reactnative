import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function BeritaScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/beritas')
      .then(response => {
        console.log('API Response:', response.data);
        if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
          setData(response.data.data.data);
        } else {
          console.error('Response data is not an array:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Berita Pekanbaru</Text>
      {data.map((item, index) => (
        <View style={styles.card} key={index}>
          <Image
            source={{ uri: "https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/storage/berita/" + item.foto_berita }} 
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>{item.judul_berita}</Text>
          <View style={styles.iconContainer}>   
            <Image
              source={require('./../../assets/images/icon1.png')}
              style={styles.icon}
            />
            <Text style={styles.iconText}>{item.tgl_terbit_berita}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Detail Berita', { berita: item })}>
              <Text style={styles.iconText2}>Selengkapnya</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  iconContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain'
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
  iconText2: {
    fontSize: 14,
    color: '#008080',
    marginLeft: 150
  }
});
