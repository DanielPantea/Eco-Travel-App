import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView, StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native'
import { ListItem } from 'react-native-elements'
import React, {useEffect, useRef, useState} from 'react'
import {VehicleTypes, VehicleSizes} from "../../models/vehicle";
import BusIcon from "../../../assets/bus.png";
import {FilterOptions, FilterTypes} from "../../models/filter";

const RouteFilter = ({itemStyle, routes, onSelected}) => {

    const [options, setOptions] = useState([
        {
            route_id: 0,
            text: 'Hide All'
        },
    ].concat(routes));

    const onOptionSelect = (route_id) => {

        if(route_id == 1) {
            Alert.alert(
                "Careful!",
                "This option can slow down the performance of the app",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => onSelected(route_id) }
                ]
            );
        }
        else onSelected(route_id)

    }

    return (
        <FlatList style={{width:'100%'}}
                  data={options}
                  renderItem={({ item, index }) => {
                      if(item.route_id == 0)
                          return (
                              <TouchableHighlight onPress={() => onOptionSelect(item.route_id)}>
                                  <View style={itemStyle}>
                                      <Text style={[styles.text]}>{item.text}</Text>
                                  </View>
                              </TouchableHighlight>
                          )
                      else
                          return (
                              <TouchableHighlight onPress={() => onOptionSelect(item.route_id)}>
                                  <View style={itemStyle}>
                                      <Text style={[styles.route, {backgroundColor: `#${item.route_color}`, color: `#${item.route_text_color}`}]}>{item.route_short_name}</Text>
                                      <Text style={{position:'absolute', right:10, top:39, opacity: 0.4}}>{item.trips_array[0].trip_headsign} - {item.trips_array[1].trip_headsign}</Text>
                                  </View>
                              </TouchableHighlight>
                          )
                  }}
                  keyExtractor={(item, index) => item.route_id}
        />
    )
}

export default RouteFilter

const styles = StyleSheet.create({
    route: {
        width:95,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 5,
        marginTop:5,
        marginBottom:23,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    text: {
        alignSelf:'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
         backgroundColor: '#42b34e',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical:10,
        borderRadius: 10,
        color: 'white'
    }
});