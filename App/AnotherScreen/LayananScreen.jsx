import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LayananScreen() {
  const layananData = [
    {
      category: 'Layanan Administrasi',
      services: [
        { name: 'SIAP MPP', description: 'Sistem Informasi Antrian dan Pengaduan', icon: require('./../../assets/images/mpp.jpg') },
      ],
    },
    {
      category: 'Layanan Perizinan dan Pengelolaan',
      services: [
        { name: 'SIMOLEK', description: 'Sistem Informasi Manajemen Pelayanan Perizinan', icon: require('./../../assets/images/simolek1.png') },
        { name: 'BPN Kota Pekanbaru', description: 'Sistem Informasi Pertanahan dan Tata Ruang', icon: require('./../../assets/images/bpn1.png') },
        { name: 'BAPENDA', description: 'Sistem Informasi Badan Pendapatan Daerah', icon: require('./../../assets/images/bapeda.png') },
        { name: 'LPSE', description: 'Sistem Informasi Layanan Pengadaan Secara Elektronik', icon: require('./../../assets/images/lpse.jpg') },
      ],
    },
    {
      category: 'Layanan Pendidikan',
      services: [
        { name: 'SIPADU', description: 'Sistem Informasi Pelayanan Terpadu', icon: require('./../../assets/images/sipadu.png') },
      ],
    },
    {
      category: 'Layanan Kejaksaan dan Pengadilan',
      services: [
        { name: 'Kejaksaan Negeri Pekanbaru', description: 'Sistem Informasi Kejaksaan Negeri Pekanbaru', icon: require('./../../assets/images/kejaksaan.jpeg') },
        { name: 'Pengadilan Negeri Pekanbaru', description: 'Sistem Informasi Pengadilan Negeri Pekanbaru', icon: require('./../../assets/images/pengadilan.png') },
        { name: 'Pengadilan Agama Pekanbaru', description: 'Sistem Informasi Pengadilan Agama Pekanbaru', icon: require('./../../assets/images/pengadilan2.jpg') },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
    
      {layananData.map((category, index) => (
        <View key={index}>
          <Text style={styles.categoryText}>{category.category}</Text>
          {category.services.map((service, idx) => (
            <View key={idx} style={styles.serviceContainer}>
              <Image source={service.icon} style={styles.serviceIcon} />
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
             
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  categoryText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#007BFF',
  },
});
