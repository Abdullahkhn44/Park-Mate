import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
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
import image2 from './assets/parking.gif'

const MapSession = () => {

    //METHODS
    const dispatch = useDispatch()
    const mapRef = useRef(null);
    const router = useRouter()

    //STATES
    const [isViewerVisible, setViewerVisible] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [mylongitude, setmyLongitude] = useState('');
    const [mylatitude, setmyLatitude] = useState('');
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState('');





    // CARS LOCATION FROM STORAGE
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
        const region = {
            latitude: latitude || 33.6995,
            longitude: longitude || 73.0363,
            latitudeDelta: latitude ? 0.001 : 0.9,
            longitudeDelta: longitude ? 0.001 : 0.9,

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
        // const region = {
        //     latitude: latitude,
        //     longitude: longitude,
        //     latitudeDelta: 0.001,
        //     longitudeDelta: 0.001,

        // };

        // if (mapRef.current) {
        //     mapRef.current.animateToRegion(region, 3000);

        // }

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
                const geoReverse = fetch(`https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },

                }).then(response => response.json())
                    .then(data => setAddress(data.display_name))
                    .catch(error => console.error('Error:', error));

                if (address) {
                    const saveAddress = await AsyncStorage.setItem('savedAddress', address)
                    console.info(saveAddress, address)
                    Toast.show({
                        type: 'success',
                        text1: 'Session Saved',
                        text2: 'Session saved in History ✅'
                    });

                }


            } catch (error) {
                console.error('Error geocoding function', error);
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
                                    <Image source={require('./assets/parking.gif')} style={styles.image} />
                                )}
                            </View>
                        </TouchableOpacity>
                        <ImageView
                            images={[images]}
                            imageIndex={0}
                            visible={isViewerVisible}
                            onRequestClose={() => setViewerVisible(false)}

                        />
                        <TouchableOpacity style={styles.bottomButton} onPress={() => OpenNavigation(latitude, longitude, mylatitude, mylongitude)} >
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
        left: 20,
        right: 20,
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
        width: 335
    },
    infoText: {

        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },


    imageBottomView: {

    },
    buttonBottomView: {
        top: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    image: {
        width: 100,
        height: 125,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 5,
        // top: 15
    },
    twoButtonBottomView: {
        flexDirection: 'row',
        gap: 15,

    },
    oneButtonBottomView: {
        left: 56,
        bottom: 34,

    },
    bottomButton: {
        backgroundColor: '#1a1f2f',
        borderRadius: 5,
        height: 85,
        width: 85,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 5,

    },
    oneBottomButton: {
        width: 184,
        height: 37,
        borderRadius: 5,
        backgroundColor: '#ff2c55',
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '500'
    },
})