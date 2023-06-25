import React from 'react'
import {View, StyleSheet, Animated, TouchableOpacity, Platform, StatusBar} from 'react-native'
import {AntDesign} from '@expo/vector-icons'

const FilterButton = ({ onPress }) => {
    return (
            <TouchableOpacity style={[styles.container, styles.button]} onPress={onPress}>
                <AntDesign name='filter' size={24} color={'#FFF'}/>
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
        position: 'absolute',
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + 155,
        right: 8
    },

    button: {
        width: 45,
        height:45,
        borderRadius: 45 / 2,
        justifyContent: 'center',
        backgroundColor: '#279032',
    },
})

export default FilterButton