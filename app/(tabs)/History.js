import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from '@react-native-async-storage/async-storage';




const renderItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.addressText}>{item.address}</Text>
    <Text style={styles.dateText}>{item.date}</Text>
  </View>
);

const History = () => {

  const [history, setHistory] = useState([]);

useFocusEffect(
  useCallback(() => {
    const getItems = async () => {
      const savedAddress = await AsyncStorage.getItem('savedAddress');
      const savedMoment = await AsyncStorage.getItem('savedMoment');


      if (savedAddress && savedMoment) {
        // Get existing history from AsyncStorage
        const existingHistory = await AsyncStorage.getItem('history');
        const parsedHistory = existingHistory ? JSON.parse(existingHistory) : [];

        // Add new entry
        const newEntry = { address: savedAddress, date: savedMoment };
        const updatedHistory = [newEntry, ...parsedHistory]; // Newest first

        // Save updated history back to AsyncStorage
        await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));

        // Update state
        setHistory(updatedHistory);
      }
    };

    getItems();
  }, [])
);
  return (
    <View style={styles.container}>
      <FlashList
        data={history}
        renderItem={renderItem}
        estimatedItemSize={50}
      />
    </View>
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
