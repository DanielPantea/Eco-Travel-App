import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

const CustomButton = ({ text, icon, type="Ionicons", onPress}) => {

    switch (type){
        case 'Ionicons':
            return (
                <TouchableOpacity style={styles.menuBarIcon} onPress={onPress}>
                        <Ionicons name={icon} size={26} style={styles[`${text}Icon`]} ></Ionicons>
                        <Text style={styles.text}>{text}</Text>
                </TouchableOpacity>
            );
        case 'FontAwesome':
            return (
                <TouchableOpacity style={styles.menuBarIcon} onPress={onPress}>
                        <FontAwesome name={icon} size={26} style={styles[`${text}Icon`]} ></FontAwesome>
                        <Text style={styles.text}>{text}</Text>
                </TouchableOpacity>
            );
        case 'MaterialIcons':
            return (
                <TouchableOpacity style={styles.menuBarIcon} onPress={onPress}>
                        <MaterialIcons name={icon} size={26} style={styles[`${text}Icon`]} ></MaterialIcons>
                        <Text style={styles.text}>{text}</Text>
                </TouchableOpacity>
            );     
        default: break;
    }
}

const styles = StyleSheet.create({
    
    text:{
        fontSize: 12
    },

    menuBarIcon:{
        flex: 1,
        alignItems: 'center'
    },

    BileteIcon:{
        color: '#35AE0A'
    },

    AbonamenteIcon:{
        color: '#35AE0A',
    },

    HartaIcon:{
        color: '#35AE0A',
    },

    LiniiIcon:{
        color: '#35AE0A',
    },

    ContIcon:{
        color: '#35AE0A',
    }
          
})

export default CustomButton