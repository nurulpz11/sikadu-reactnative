import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function KontakScreen() {
  const services = [
    {
      name: 'Ambulans',
      description: '+199',
      image: require('./../../assets/images/ambulance3.png'),
    },
    {
      name: 'Pemadaman Kebakaran',
      description: '+133',
      image: require('./../../assets/images/pemadaman3.png'),
    },
    {
      name: 'Polisi',
      description: '+110',
      image: require('./../../assets/images/police3.png'),
    },
    {
      name: 'Posko Kewaspadaan Nasional',
      description: '+112',
      image: require('./../../assets/images/mpp.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nomor Darurat </Text>
      {services.map((service, index) => (
        <TouchableOpacity key={index} style={styles.serviceContainer}>
          <Image source={service.image} style={styles.serviceImage} />
          <View style={styles.serviceTextContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'left',
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: 'gray',
  },
});
