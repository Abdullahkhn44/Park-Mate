import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MapHistory = () => {
    const [mapHistory, setMapHistory] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const mapRef = useRef(null);
    useFocusEffect(
        useCallback(() => {
            const getItems = async () => {
                try {
                    // Fetch saved latitude & longitude
                    const savedLocations = await AsyncStorage.multiGet(["latitude", "longitude"]);

                    if (savedLocations[0][1] && savedLocations[1][1]) {
                        const lat = parseFloat(savedLocations[0][1]);
                        const lon = parseFloat(savedLocations[1][1]);

                        // Get existing history from AsyncStorage
                        const existingHistory = await AsyncStorage.getItem("MapHistory");
                        const parsedHistory = existingHistory ? JSON.parse(existingHistory) : [];

                        // Add new entry
                        const newEntry = { latitude: lat, longitude: lon };
                        const updatedHistory = [newEntry, ...parsedHistory];

                        // Save updated history back to AsyncStorage
                        await AsyncStorage.setItem("MapHistory", JSON.stringify(updatedHistory));

                        // Update state
                        setMapHistory(updatedHistory);
                        setCurrentLocation({ latitude: lat, longitude: lon }); // Set last saved location as current
                    }
                } catch (error) {
                    console.log("Error fetching location history:", error);
                }
            };
            const region = {
                latitude: currentLocation?.latitude ,
                longitude: currentLocation?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            getItems();
            if (mapRef.current) {
                mapRef.current.animateToRegion(region, 3000);

            }
        }, [])
    );

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation?.latitude ,
                    longitude: currentLocation?.longitude ,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}

            >
                {/* Render markers from history */}
                {mapHistory.map((item, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        title={`Parked Here`}

                    />
                ))}
            </MapView>
        </View>
    );
};

export default MapHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },

    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});
