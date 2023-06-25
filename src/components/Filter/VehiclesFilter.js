import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View, Alert} from 'react-native'
import { ListItem } from 'react-native-elements'
import React, {useEffect, useRef, useState} from 'react'
import {VehicleTypes, VehicleSizes} from "../../models/vehicle";
import BusIcon from "../../../assets/bus.png";
import {FilterTypes} from "../../models/filter";

const types = [
    {
        key: FilterTypes.SHOW_ALL,
        name: 'Show All'
    },
    {
        key: FilterTypes.SHOW_NEARBY,
        name: 'Show Nearby'
    },
    {
        key: FilterTypes.HIDDEN,
        name: 'Hide All'
    },
    {
        key: FilterTypes.ROUTE,
        name: 'Show on Selected Route'
    }
]

const VehiclesFilter = ({itemStyle, onSelected}) => {

    const onOptionSelect = (type) => {

        if(type == FilterTypes.SHOW_ALL) {
            Alert.alert(
                "Careful!",
                "This option can slow down the performance of the app",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => onSelected(type) }
                ]
            );
        }
        else onSelected(type)

    }

    return (
        <FlatList style={{width:'100%'}}
                  data={types}
                  renderItem={({ item, index }) => {
                      return (
                          <TouchableHighlight onPress={() => onOptionSelect(item.key)}>
                              <View style={itemStyle}>
                                  <Text style={{padding: 20, fontSize:16}}>{item.name}</Text>
                              </View>
                          </TouchableHighlight>
                      )
                  }}
        />
    )
}

export default VehiclesFilter

const styles = StyleSheet.create({

});