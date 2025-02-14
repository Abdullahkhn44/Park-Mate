import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
import { useSelector } from 'react-redux'
import CusButton from '../components/CusButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OpenNavigation from '../components/Navigate'

const Home = () => {
  const router = useRouter();
  const { isSessionStarted } = useSelector((state) => state.parkingSession);

  const [text, setText] = useState(null);
  const [time, setTime] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mylongitude, setmyLongitude] = useState('');
  const [mylatitude, setmyLatitude] = useState('');

  console.log('session ', isSessionStarted)


  // USERS LOCATION
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
        setmyLatitude(getlocation.coords.latitude);

        setmyLongitude(getlocation.coords.longitude);

      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Unable to fetch location. Please try again.');
      }
    }


    getCurrentLocation();
  }, [mylatitude, mylongitude]);
  //USERS LOCATION ENDED

  useEffect(() => {


    async function getCurrentLocation() {
      try {

        const result = await AsyncStorage.multiGet(["latitude", "longitude"]);

        if (result) {

          setLatitude(parseFloat(result[0][1]));
          setLongitude(parseFloat(result[1][1]));

        } else {
          console.log("No data found for latitude or longitude");
        }
      } catch (e) {
        console.log("Error retrieving latitude and longitude:", e);
      }

    }


    getCurrentLocation();

  }, [latitude, longitude])
  // CARS LOCATION FROM STORAGE ENDED


  // OPEN GOOGLE MAP APP
  const googleMapOpenUrl = ({ latitude, longitude, mylatitude, mylongitude }) => {
    const dest = `${latitude},${longitude}`;
    const start = `${mylatitude},${mylongitude}`;
    let url = '';
    console.info('dest', dest);
    console.info('start', start);
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?saddr=${start}&daddr=${dest}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${dest}&dir_action=navigate&basemap=roadmap`;
    }

    return url;

  };

  // OPEN GOOGLE MAP APP
  const OpenNavigation = async (latitude, longitude, mylatitude, mylongitude) => {
    try {
      const url = googleMapOpenUrl({ latitude, longitude, mylatitude, mylongitude });
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening navigation:', error);
      // Handle the error
      if (Platform.OS === 'android') {
        // Fallback for Android
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        Linking.openURL(webUrl);
      }
    }
  };



  useEffect(() => {

    const loadImage = async () => {
      try {

        const textValue = await AsyncStorage.getItem('textLocation');
        const timeValue = await AsyncStorage.getItem('savedMoment');
        if (textValue && timeValue !== null) {

          setText(textValue);
          setTime(timeValue);

        }
      } catch (e) {
        console.error('Error getting values:', e);
      }
    };

    loadImage();
  }, []);


  const navigateToMapSession = () => router.push('/MapSession');
  const navigateToHistory = () => router.push('History');


  return (

    <View style={styles.mainView}>
      <StatusBar style="light" backgroundColor='black' />
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Parking Mate</Text>
        <Text style={styles.tipsText}>Tip: "Park near exits for quicker access"</Text>
      </View>

      {isSessionStarted ?
        <View style={styles.newButtonView}>

          <CusButton
            text={'Active Parking Session'} style={styles.mainButton} iconStyle={styles.iconstyling}
            locationText={text}
            iconName={'car'} size={105}
            timeText={time}
            mapText={'View Details'}
            newIcon={'location-arrow'} newSize={25} newIconStyle={styles.newIconstyling}
            onPress={navigateToMapSession}
          />

          <CusButton text={'Navigate to Vehicle'} style={styles.secButton} iconName={'route'} iconStyle={styles.iconstyling2} size={40} onPress={() => OpenNavigation(latitude, longitude, mylatitude, mylongitude)} />

          <CusButton text={'History'} style={styles.thirdButton} iconName={'map-location-dot'} iconStyle={styles.iconstyling3} size={40} onPress={navigateToHistory} />

        </View>

        :

        <View style={styles.ButtonView}>
          <Button text={'Lets Park'} onPress={() => router.push('/Map')} />

          {/* <Button text={'Find My Vehicle'} /> */}

          <Button text={'Map History'} />
          <Button text={'History'} onPress={navigateToHistory} />

        </View>

      }



    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'black',

  },
  headingView: {
    flex: 0.25,
    margin: 25
  },
  headingText: {
    fontSize: 45,
    fontWeight: '700',
    color: "white",

  },
  tipsText: {
    fontSize: 15,
    fontWeight: '400',
    color: "white",
    fontStyle: "italic",
    top: 10

  },
  ButtonView: {

    flexWrap: 'wrap',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    flexDirection: 'row',

  },
  newButtonView: {
    margin: 20,
    flexWrap: 'wrap',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    flexDirection: 'column',


  },
  mainButton: {
    backgroundColor: '#079eda',
    borderRadius: 10,
    height: 315,
    width: 170,
    gap: 25

  },

  secButton: {
    backgroundColor: '#b0e7fc',
    borderRadius: 8,
    height: 150,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',


  },
  thirdButton: {
    backgroundColor: '#f4a6b2',
    borderRadius: 8,
    height: 150,
    width: 140,
    alignItems: 'center', justifyContent: 'center',

  },
  iconstyling: {
    bottom: 48,
    left: 110,
    opacity: 0.5
  },
  iconstyling2: {
    bottom: 22,
    left: 45,
    opacity: 0.5

  }, iconstyling3: {
    bottom: 10,
    left: 42,
    opacity: 0.5

  },
  newIconstyling: {
    bottom: 48,
    left: 110
  },
})