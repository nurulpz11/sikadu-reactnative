import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function AnotherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status Laporan</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <View style={styles.statusIndicator}></View>
            <Text style={styles.statusText}>Menunggu</Text>
            <Text style={styles.countText}>0</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.totalText}>TOTAL</Text>
            <Text style={styles.totalCount}>0</Text>
            <Text style={styles.summaryText}>Ringkasan</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#E6EDFF',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
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
    backgroundColor: '#0033CC',
    borderRadius: 8,
    padding: 12,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
})
