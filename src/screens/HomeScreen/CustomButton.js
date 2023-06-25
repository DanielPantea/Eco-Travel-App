import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'



const CustomButton = ({ onPress, text}) => {
  return (
    <TouchableOpacity 
        onPress={onPress}  
        style={[styles.container, styles.containerLogIn]}
    >
      <Text style={[styles.text, styles.textLogIn]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        padding: 10,
        alignItems: 'center',
        borderRadius: 8,
        opacity: 1,
        marginTop: 10
    },

    text: {
        fontWeight: '500',
        fontSize: 14
    },

    containerLogIn: {
      backgroundColor: '#85DD66',
      width: 150,
    },
    
    textLogIn: {
      color: 'white',
    },
})

export default CustomButton