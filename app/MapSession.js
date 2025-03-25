import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImageView from "react-native-image-viewing";
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { useDispatch } from 'react-redux';
import { setisSessionStarted } from '../Redux/parkingSessionSlice';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { API_KEY } from '@env';


const MapSession = () => {

    //METHODS
    const dispatch = useDispatch()
    const mapRef = useRef(null);
    const router = useRouter()

    //STATES
    const [isViewerVisible, setViewerVisible] = useState(false);
    const [latitude, setLatitude] = useState(33.6844);
    const [longitude, setLongitude] = useState(73.0479);
    const [mylongitude, setmyLongitude] = useState('');
    const [mylatitude, setmyLatitude] = useState('');
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState('');





    // CARS LOCATION FROM STORAGE
    useEffect(() => {


        async function getCurrentLocation() {
            try {

                const result = await AsyncStorage.multiGet(["latitude", "longitude"]);
                console.info(result)
                if (result) {
                    const storedLatitude = result[0][1];
                    const storedLongitude = result[1][1];

                    // if (storedLatitude && storedLongitude) {
                    //     setLatitude(parseFloat(storedLatitude));
                    //     setLongitude(parseFloat(storedLongitude));
                    //     console.info("Retrieved Location:", { storedLatitude, storedLongitude });
                    // } else {
                    //     console.warn("One or both values are missing in AsyncStorage");
                    // }
                } else {
                    console.warn("No location data found in AsyncStorage");
                }
            } catch (e) {
                console.log("Error retrieving latitude and longitude:", e);
            }

        }
        const region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,

        };

        if (mapRef.current) {
            mapRef.current.animateToRegion(region, 4000);

        }


        // GETTING IMAGE FROM STORAGE
        const loadImage = async () => {
            try {
                const imageValue = await AsyncStorage.getItem('savedImage');


                if (imageValue !== null) {
                    setImage(imageValue);

                }
            } catch (e) {
                console.error('Error getting Image value:', e);
            }
        };

        loadImage();
        getCurrentLocation();

    }, [latitude, longitude])
    // CARS LOCATION FROM STORAGE ENDED

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
    }, [mylatitude, mylongitude]);
    //USERS LOCATION ENDED

    const images = { uri: image, };

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
        if (typeof latitude === 'number' && typeof longitude === 'number') {
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
        }
    };

    // OPEN GOOGLE MAP APP END


    // ANIMATE TO USERS LOCATION
    const MyLocation = async () => {
        const region = {
            latitude: mylatitude,
            longitude: mylongitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,

        };

        if (mapRef.current) {
            mapRef.current.animateToRegion(region, 3500);

        }
    }
    // ANIMATE TO USERS LOCATION END



    //END SESSION BUTTON FUNCTION STARTS

    const EndSession = () => {

        dispatch(setisSessionStarted(false));

        router.push('Home');

        const UpdateHistory = async () => {

            try {
                //GEO REVERSE API
                const geoReverse = await fetch(`https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }
                );

                if (!geoReverse.ok) {
                    throw new Error(`HTTP error! status: ${geoReverse.status}`);
                }

                const data = await geoReverse.json();
                // const address = data.display_name;


                if (data) {

                    const address = `${data.road || "Unknown Road"}, ${data.suburb || "Unknown Area"}, ${data.city || "Unknown City"}`;

                    await AsyncStorage.setItem('savedAddress', address);
                    console.info('address saved:', address);
                    Toast.show({
                        type: 'success',
                        text1: 'Session Saved',
                        text2: 'Session saved in History ✅',
                    });
                } else {
                    console.log("no address was returned from reverse geocode")
                }


            } catch (error) {
                console.error('Error in UpdateHistory:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Save Failed',
                    text2: 'Session not saved in History ❌',
                });
            }
        }


        UpdateHistory()

    }

    //END SESSION BUTTON FUNCTION ENDS//


    //-- -- --- -- -- -- -- -- -- -- -- -- -- --//


    return (


        <View style={styles.container}>
            <MapView ref={mapRef} style={styles.map}>

                {
                    latitude && longitude ? (

                        <Marker
                            pinColor='#A836F8'
                            title='Car Location'
                            coordinate={{ latitude: latitude, longitude: longitude }}
                        />
                    ) : null
                }
                {
                    mylatitude && mylongitude ? (
                        <Marker

                            title='Your Location'
                            coordinate={{ latitude: mylatitude, longitude: mylongitude }}
                        />
                    ) : null
                }

            </MapView>


            <View style={styles.bottomView}>
                <Text style={styles.infoText}>Active Parking Session</Text>



                <View style={styles.buttonBottomView}>

                    <View style={styles.twoButtonBottomView}>
                        <TouchableOpacity onPress={() => setViewerVisible(true)}>
                            <View style={styles.imageBottomView}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.image} />
                                ) : (
                                    <Image
                                        source={{ uri: 'https://www.freepik.com/animated-icon/parking_18818414#fromView=search&page=1&position=0&uuid=6129cdcd-85b2-44b1-af27-5e6c9a99ceff' }}
                                        style={styles.image}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                        <ImageView
                            images={[images]}
                            imageIndex={0}
                            visible={isViewerVisible}
                            onRequestClose={() => setViewerVisible(false)}

                        />
                        <TouchableOpacity style={styles.bottomButton} onPress={() => OpenNavigation(latitude, longitude, mylatitude, mylongitude)} disabled={latitude === null || longitude === null} >
                            <Text style={styles.buttonText}>Navigate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bottomButton} onPress={() => MyLocation()}>
                            <Text style={styles.buttonText}>My Location</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={styles.oneButtonBottomView}>

                        <TouchableOpacity style={styles.oneBottomButton} onPress={() => EndSession()}>
                            <Text style={styles.buttonText}>End Parking Session</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        </View>
    )
}

export default MapSession

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    bottomView: {

        height: 235,
        position: 'absolute',
        bottom: 20,
        left: 7,
        backgroundColor: '#fefefe',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 345
    },
    infoText: {

        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },


    imageBottomView: {

    },
    buttonBottomView: {
        top: 15,
        alignItems: 'center',
        justifyContent: 'center',

        width: 345
    },
    image: {
        width: 120,
        height: 145,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 5,
        // top: 15
        borderRadius: 8,
    },
    twoButtonBottomView: {
        flexDirection: 'row',
        gap: 5,

    },
    oneButtonBottomView: {
        left: 62,
        bottom: 34,

    },
    bottomButton: {
        backgroundColor: '#1a1f2f',
        borderRadius: 5,
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 5,

    },
    oneBottomButton: {
        width: 205,
        height: 37,
        borderRadius: 5,
        backgroundColor: '#ff2c55',
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '700'
    },
})