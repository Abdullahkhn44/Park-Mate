import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Settings = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.HeadingText}>Settings</Text>
      
      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.subHeading}>How This App Works</Text>
        <Text style={styles.infoText}>🚀 Save your parking location automatically.</Text>
        <Text style={styles.infoText}>📍 View your saved locations in the history.</Text>
        <Text style={styles.infoText}>🔄 Automatically fetch your GPS coordinates.</Text>
        <Text style={styles.infoText}>🗺️ Get the shortest route back to your parked vehicle.</Text>
        <Text style={styles.infoText}>💾 Your data is stored locally for quick access.</Text>
      </ScrollView>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About the App</Text>
        <Text style={styles.sectionText}>Parking Space Reminder v1.0</Text>
        <Text style={styles.sectionText}>Easily save and retrieve your parking location.</Text>
      </View>

      <TouchableOpacity style={styles.section} onPress={() => alert('📌 We value your privacy. Your location data is stored only on your device and is not shared with third parties.The app does not collect personal data beyond what is required for functionality (e.g., saving parking locations)' )}>
        <Text style={styles.sectionTitle}>📜 Privacy Policy & Terms of Use</Text>
        <Text style={styles.sectionText}>Read our policies and terms.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => alert('Contact us at abdul148.eagle@gmail.com')}>
        <Text style={styles.sectionTitle}>🔗 Support & Feedback</Text>
        <Text style={styles.sectionText}>Need help? Contact us.</Text>
      </TouchableOpacity>
    </View >
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    top: 30,
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeadingText: {

    fontSize: 30,
    fontWeight: '600',

    color: 'white'
  },
  infoContainer: {
    width: '90%',
  
    padding: 15,
    borderRadius: 10,
   
    top: 30,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 5,
  },section: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width:320,
    height:90,
bottom:20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: 'gray',
  },
})