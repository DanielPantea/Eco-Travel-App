import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({text, onPress, type}) => {
  return (
    <View>
        <TouchableOpacity 
            style={[styles.border,styles[`${type}Button`]]}
            onPress={onPress}
        >
            <Text style={[styles[`${type}Text`]]}>{text}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    border: {
        borderTopWidth: 0.5,
        borderColor: 'white'
    },
    listButton:{
        backgroundColor: '#80D562',
        paddingVertical: 15,
    },
    
    logoutButton: {
        backgroundColor: '#D42222',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black'
    },

    listText: {
        fontSize: 20, 
        marginHorizontal: 10
    },

    logoutText: {
        fontSize: 30, 
        marginHorizontal: 10
    },
})