import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MapHistory = () => {
    const [mapHistory, setMapHistory] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

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

            getItems();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Map History</Text>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation?.latitude || 37.78825, // Default if no saved location
                    longitude: currentLocation?.longitude || -122.4324,
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
                        description={`Lat: ${item.latitude}, Lon: ${item.longitude}`}
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
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.8,
    },
});
