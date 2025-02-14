import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;

const Slider = () => {


    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const handleScroll = (event) => {

        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / windowWidth);
        setActiveIndex(currentIndex);

    };

    useEffect(() => {

        const checkUser = async () => {
            try {
                const value = await AsyncStorage.getItem('userId');
                if (value !== null) {

                    router.replace("(tabs)/Home")
                    setLoading(false);
                    console.log('User navigated successfully', value)
                }
            } catch (e) {
                console.log(e)
                setLoading(false);
            }
        }
        checkUser()
    }, [router]);


    if (loading) {
        // Show a loading indicator until the check is complete
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="orange" />
            </View>
        );
    }

    const handleNavigation = async () => {
        router.replace("/pages/Home")
        const userId = uuid.v4();
        try {
            const savedUid = await AsyncStorage.setItem('userId', userId);
            console.log('User UUID Saved', savedUid)
        } catch (e) {
            console.log('User UUID Not Saved')
        }
    }

    return (
        <SafeAreaView style={styles.MainView} >
            <ScrollView style={styles.ScrollView}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                snapToInterval={windowWidth}
                decelerationRate={0}
                onMomentumScrollEnd={handleScroll}
                disableIntervalMomentum={true}

            >

                <View style={styles.sliderView} >
                    <View style={styles.Heading}>
                        <Text style={styles.HeadingText}>Park Mate</Text>
                    </View>
                    <View style={styles.container}>
                        <Image
                            style={styles.lottie}
                            source={require('../assets/main.png')}
                        />
                    </View>
                    <View style={styles.Desc}>
                        <Text style={styles.DescText}>Park Mate helps remember where you parked your vehicles using google maps. </Text>
                    </View>

                </View>

                <View style={styles.sliderViewTwo}>
                    <View style={styles.Heading}>
                        <Text style={styles.HeadingText}>Back to your vehicle</Text>
                    </View>
                    <View style={styles.container}>
                        <Image
                            style={styles.lottie}
                            source={require('../assets/navi.png')}
                        />
                    </View>
                    <View style={styles.Desc}>
                        <Text style={styles.DescText}>Park Mate helps you navigate back to your vehicle parking using google maps. </Text>
                    </View>
                </View>
                <View style={styles.sliderViewThree}>
                    <View style={styles.Heading}>
                        <Text style={styles.HeadingText}>Parking History Markers</Text>
                    </View>
                    <View style={styles.container}>
                        <Image
                            style={styles.map}
                            source={require('../assets/map.png')}
                        />
                    </View>
                    <View style={styles.Desc}>
                        <Text style={styles.DescText}>Using Park Mate you can view your parking history in Maps, marked with markers. </Text>
                    </View>


                </View>

            </ScrollView>
            {activeIndex === 2 ?
                <View style={styles.ButtonView}>
                    <TouchableOpacity onPress={handleNavigation} style={styles.Button}>
                        <Text style={styles.ButtonText}>Lets Start</Text>
                    </TouchableOpacity>

                </View> :
                <View style={styles.dotView}>


                    <View style={[styles.dot1, activeIndex === 0 ? styles.activeDot : {}]} />
                    <View style={[styles.dot1, activeIndex === 1 ? styles.activeDot : {}]} />
                    <View style={[styles.dot1, activeIndex === 2 ? styles.activeDot : {}]} />


                </View>}


        </SafeAreaView >
    )
}

export default Slider

const styles = StyleSheet.create({
    windowWidth, windowHeight,
    MainView: {
        flex: 1,


    },
    ScrollView: {
        flex: 1,
    },
    sliderView: {


        width: windowWidth,
        height: windowHeight,

    },
    sliderViewTwo: {
        width: windowWidth,
        height: windowHeight,

    },

    sliderViewThree: {
        width: windowWidth,
        height: windowHeight,

    },

    container: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Heading: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    HeadingText: {

        fontSize: 30,
        fontWeight: '600',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'orange'
    },

    Desc: {

        flex: 1,

    },
    DescText: {
        top: 30,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '400',

    },


    lottie: {
        width: 330,
        height: 190,
    },
    map: {
        width: 300,
        height: 190,
    },
    dotView: {

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 15,
        bottom: 60
    },
    dot1: {
        backgroundColor: 'gray',
        width: 8,
        height: 8,
        borderRadius: 20,
    },
    activeDot: {
        backgroundColor: 'black',
        width: 10,
        height: 10,
    },
    ButtonView: {
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 60,

    },
    Button: {
        backgroundColor: 'orange',
        width: 220,
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ButtonText: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600'

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})