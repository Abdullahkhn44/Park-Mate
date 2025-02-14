import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = ({ onPress, text }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.Button}>
            <Text style={styles.ButtonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    Button: {
        backgroundColor: 'white', 
        borderRadius: 8,
        height:150,
        width:150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonText: {
        fontSize: 25,
        fontWeight: '700',
        color: 'black'
    }
})