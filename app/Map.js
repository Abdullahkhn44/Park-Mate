import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { setLatitude, setLongitude } from '../Redux/carLocationSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import { useRouter } from 'expo-router';
import { setisSessionStarted } from '../Redux/parkingSessionSlice';

import moment from 'moment';
const Map = () => {



  const mapRef = useRef(null);
  const router = useRouter();




  const { latitude, longitude } = useSelector((state) => state.location);
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const dispatch = useDispatch()



  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          console.log('denied');
          return;
        }

        let getlocation = await Location.getCurrentPositionAsync({});
        dispatch(setLatitude(getlocation.coords.latitude));

        dispatch(setLongitude(getlocation.coords.longitude));

      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Unable to fetch location. Please try again.');
      }
    }
    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,

    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 3000);

    }

    getCurrentLocation();
  }, [dispatch, latitude, longitude]);



  const openCamera = async () => {
    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      return (
        <View style={styles.container}>
          <Text>Permission Not Granted - {permission?.status}</Text>
          <StatusBar style="auto" />
          <Button title="Request Permission" onPress={requestPermission}></Button>
        </View>
      );
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

    }
  };




  if (!latitude || !longitude) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MapView ref={mapRef} style={styles.map}></MapView>
      </View>
    );
  }



  const proceed = async () => {

    await AsyncStorage.setItem('textLocation', text);
    const latPair = ["latitude", latitude]
    const longPair = ["longitude", longitude]

    try {
      await AsyncStorage.multiSet([latPair, longPair]);
    } catch (e) {
      console.log('error in multiset', e);
    }
    console.log('User car location Saved')


    try {
      const fileName = uuid.v4();
      // Define the target directory
      const directoryPath = `${FileSystem.documentDirectory}ParkMateImages/`;

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(directoryPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
      }

      // Define the new file path
      const newFilePath = `${directoryPath}${fileName}`;

      // Copy the image to the new location
      await FileSystem.copyAsync({
        from: image,
        to: newFilePath,
      });



      console.log('Image saved at:', newFilePath);

      // return newFilePath; 

      await AsyncStorage.setItem('savedImage', newFilePath);

      const now = moment().format("MMM Do YYYY, h:mm a");

      await AsyncStorage.setItem('savedMoment', now);
      
      dispatch(setisSessionStarted(true));
      router.push('Home')
      console.log('User image uri saved')



    } catch (error) {

      console.error('Error saving image:', error);
      throw error;
    }



  }


  return (

    <View style={styles.container}>

      <MapView ref={mapRef} style={styles.map}>

        {latitude && longitude && (
          <Marker
            title="Car Parking Location"
            coordinate={{ latitude, longitude }}
          />
        )}
      </MapView>
      {latitude && longitude && (

        <View style={image ? styles.newbottomView : styles.bottomView}>
          <Text style={styles.infoText}>Parking Location Saved!</Text>

          <Text style={styles.infoSubText}>
            Add image or address you want to remember
          </Text>

          <View style={styles.childBottomView} >

            {image ? <Image source={{ uri: image }} style={styles.image} /> : <TouchableOpacity style={styles.cameraButton} onPress={openCamera} >
              <Feather name="camera" size={26} color="black" />
            </TouchableOpacity>}


            <TextInput
              style={styles.textInput}
              placeholder='Address, number or anything to save'
              maxLength={38}
              onChangeText={(text) => setText(text)}
            />
            <View >
              <TouchableOpacity style={styles.bottomButton} onPress={proceed}>
                <Text style={styles.buttonText}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>

          </View>



        </View>)}
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  saveComponent: {
    flex: 0.5,
    backgroundColor: 'black'
  },
  bottomView: {
    height: 230,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',

  },
  newbottomView: {
    height: 380,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  childBottomView: {
    width: 300,
    height: 120,
    justifyContent: 'space-around',
    alignItems: 'center',


  },
  textInput: {
    width: 270,
    borderBottomWidth: 1,
    borderRadius: 1,
    borderColor: 'black',
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    top: 20,
    textAlign: 'center'
  },
  cameraButton: {
    top: 10
  },
  image: {
    width: 190,
    height: 190,
    borderRadius: 100,
    top: 15
  },
  bottomButton: {
    width: 280,
    height: 40,
    borderRadius: 8,
    top: 35,
    backgroundColor: 'black',
    justifyContent: 'center',

  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600'
  },

})