import React, {useEffect, useState} from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    BackHandler,
    TouchableHighlight, FlatList
} from "react-native";
import {VehicleTypes, VehicleSizes} from "../../models/vehicle";
import Bus from "../../../assets/bus_icon.png";
import Tram from "../../../assets/tram_icon.png";
import Trolley from "../../../assets/trolleybus_icon.png";
import Small from "../../../assets/small-bus.png";
import Normal from "../../../assets/normal-bus.png";
import Large from "../../../assets/large-bus.png";

const VehicleChooser = ({vehicle, setVehicle, routes, setTitleText}) => {

    const [lines, setLines] = useState([{
        lineNumber: 1,
        lineType: VehicleTypes.TRAM,
        lineRoute: "Gara de Nord - Meteo"
    },
    {
        lineNumber: 2,
        lineType: VehicleTypes.TRAM,
        lineRoute: "City Mall - Meteo"
    },
    {
        lineNumber: 11,
        lineType: VehicleTypes.BUS,
        lineRoute: "Ghe. Baritiu - Arena Aqua"
    },
    {
        lineNumber: 16,
        lineType: VehicleTypes.BUS,
        lineRoute: "Gir. Bv. Sudului - T. Grozavescu"
    }])

    useEffect(() => {
        if(vehicle.type != null && vehicle.line != null & vehicle.size != null) {
            setVehicle(prevState => ({
                ...prevState,
                isSet: true
            }));
        }
    });

    const onVehicleTypeSelect = (vehicleType) => {
        setVehicle(prevState => ({
            ...prevState,
            type: vehicleType
        }));
    }

    const onVehicleLineSelect = (vehicleLine) => {
        setVehicle(prevState => ({
            ...prevState,
            line: vehicleLine
        }));
    }

    const onVehicleSizeSelect = (vehicleSize) => {
        setVehicle(prevState => ({
            ...prevState,
            size: vehicleSize
        }));
    }

    if(vehicle.type == null) {

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => { onVehicleTypeSelect(VehicleTypes.BUS); setTitleText('Alege ruta:') }}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Autobuz') }}
                    onPressOut={() => { setTitleText('Alege un vehicul:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Bus}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { onVehicleTypeSelect(VehicleTypes.TROLLEYBUS); setTitleText('Alege ruta:') }}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Troleibuz') }}
                    onPressOut={() => { setTitleText('Alege un vehicul:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Trolley}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { onVehicleTypeSelect(VehicleTypes.TRAM); setTitleText('Alege ruta:') }}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Tramvai') }}
                    onPressOut={() => { setTitleText('Alege un vehicul:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Tram}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    else if(vehicle.line == null) {

        return (
            <View style={styles.listContainer}>

                <FlatList style={{width:'100%'}}
                          data={routes.filter(r => r.route_type == vehicle.type)}
                          renderItem={({ item, index }) => {
                              return (
                                  <TouchableHighlight onPress={() => { onVehicleLineSelect(item.route_id); setTitleText('Alege dimensiunea:')}}>
                                      <View style={styles.item}>
                                          <Text style={{padding: 20, fontSize:16}}>{item.route_long_name}</Text>
                                          <Text style={{position:'absolute', right:10, top:20, opacity: 0.4}}>{item.trips_array[0].trip_headsign} - {item.trips_array[1].trip_headsign}</Text>
                                      </View>
                                  </TouchableHighlight>
                              )
                          }}
                          keyExtractor={(item, index) => item.route_id}
                />
            </View>
        )
    }
    else if(vehicle.size == null) {

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => onVehicleSizeSelect(VehicleSizes.SMALL)}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Mic') }}
                    onPressOut={() => { setTitleText('Alege dimensiunea:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Small}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onVehicleSizeSelect(VehicleSizes.NORMAL)}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Normal') }}
                    onPressOut={() => { setTitleText('Alege dimensiunea:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Normal}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onVehicleSizeSelect(VehicleSizes.LARGE)}
                    style={[styles.type]}
                    onLongPress={() => { setTitleText('Mare') }}
                    onPressOut={() => { setTitleText('Alege dimensiunea:') }}
                    delayLongPress={200}
                >
                    <Image
                        source={Large}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default VehicleChooser

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    listContainer: {
        paddingTop: 60,
        width: '100%',
        height: '100%'
    },
    type: {
        elevation: 10,
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 7,
        opacity: 1,
        backgroundColor: '#80D562',
        width: 200,
        height: 200
    },

    line: {
        elevation: 5,
        padding: 10,
        margin: 10,
        borderRadius: 7,
        opacity: 1,
        backgroundColor: '#80D562',
        width: 300,
    },

    text: {
        fontWeight: '500',
        fontSize: 17,
        color: 'white',
    },

    logo: {
        width: '100%',
        height: '100%',
    },

    item: {
        flex: 1,
        backgroundColor: '#ebe6e6',
        borderColor: '#827e7e',
        borderStyle: 'solid',
        borderTopWidth:0.5,
    },
});