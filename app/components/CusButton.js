import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const CusButton = ({ onPress, text, style,iconStyle, locationText,iconName,size,timeText,mapText,newIcon,newIconStyle,newSize }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}  >
            <Text style={styles.ButtonText}>{text}</Text>
            <Text style={styles.locationText}>{locationText}</Text>
            <Text style={styles.locationText}>{timeText}</Text>
            <Text style={styles.locationText}>{mapText}</Text>
            <FontAwesome6 name={newIcon}  style={newIconStyle} size={newSize} color="white" />
            <FontAwesome6 name={iconName}  style={iconStyle} size={size} color="black" />
          
          
        </TouchableOpacity>
    )
}

export default CusButton

const styles = StyleSheet.create({

    ButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'Black',
        letterSpacing:0.5,
    top: 14,
        marginLeft: 10,
    },

    locationText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
    }, 
})