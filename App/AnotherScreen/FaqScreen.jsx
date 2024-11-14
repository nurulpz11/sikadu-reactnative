import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Pastikan Anda sudah menginstall package ini

export default function FaqScreen() {
  const [faqs, setFaqs] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('https://3c05-2001-448a-1082-bd03-8db5-50ea-f50-f0e8.ngrok-free.app/api/faqs');
      const json = await response.json();
      setFaqs(json.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>F.A.Q.</Text>
      
      {faqs.map((faq, index) => (
        <View key={faq.id} style={styles.faqContainer}>
          <TouchableOpacity onPress={() => toggleExpand(index)}>
            <View style={styles.faqHeader}>
              <Text style={styles.question}>{faq.pertanyaan}</Text>
              <Icon name={expanded === index ? 'chevron-up' : 'chevron-down'} size={20} color="white" />
            </View>
          </TouchableOpacity>
          {expanded === index && (
            <View style={styles.faqContent}>
              <Text style={styles.answer}>{faq.jawaban}</Text>
            </View>
          )}
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065D68',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#065D68',
    marginBottom: 20,
  },
  faqContainer: {
    marginBottom: 8,
    backgroundColor: '#ABD2D7',
    borderRadius: 15,
  },
  faqHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.26,
    borderBottomColor: '#538E95',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  faqContent: {
    padding: 15,
  },
  answer: {
    fontSize: 14,
    color: '#ffffff',
  },
});
