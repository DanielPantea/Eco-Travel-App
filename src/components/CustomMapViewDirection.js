import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapViewDirections from 'react-native-maps-directions'

const CustomMapViewDirection = ({mode}) => {

    function getPolylineByMode() {
        if(mode === "walking") {
            return (
                <MapViewDirections
                
                />
            )
        }
    }
    return (
        <View>
        {getPolylineByMode()}
        </View>
    )
}

export default CustomMapViewDirection

const styles = StyleSheet.create({})