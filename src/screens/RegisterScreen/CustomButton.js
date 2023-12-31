import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'



const CustomButton = ({ onPress, text, type = "LogIn"}) => {
  return (
    <TouchableOpacity 
        onPress={onPress}  
        style={[styles.container, styles[`container${type}`]]}
    >
      <Text style={[styles.text, styles[`text${type}`]]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7,
        opacity: 1
    },

    text: {
        fontWeight: '500',
        fontSize: 14
    },

    containerRegister: {
      marginTop: 20,
      backgroundColor: '#80D562',
      width: 250,
    },

    textRegister: {
      color: 'black',
    }
})

export default CustomButton