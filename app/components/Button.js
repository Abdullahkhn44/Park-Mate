import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
const Button = ({ iconStyle, iconName, size, onPress, text, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <Text style={styles.ButtonText}>{text}</Text>
            <FontAwesome6 name={iconName} style={iconStyle} size={size} color="black" />
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    Button: {
        backgroundColor: 'white',
        borderRadius: 8,
        height: 150,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'left'
    },
    ButtonText: {
        fontSize: 22,
        fontWeight: '700',
        color: 'black',
        top: 12,

    }
})