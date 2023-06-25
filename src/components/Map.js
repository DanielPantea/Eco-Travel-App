import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { Marker, Callout, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import MapView from "react-native-map-clustering";
import { useSelector } from 'react-redux'
import { selectDestination, selectOrigin, selectGoogleDirection } from './navSlice'
import MapViewDirection from "react-native-maps-directions"
import { GOOGLE_API_KEY } from '@env'
import BusIcon from "../../assets/bus.png";
import TramIcon from "../../assets/tram.png";
import BusMarker from "../../assets/bus-marker.png";
import {VehicleTypes, VehicleSizes} from "../models/vehicle";
import {mapStyle} from './mapStyle'
import {getDistance} from "geolib";
import {FilterTypes} from "../models/filter";


const Map = ({currentLocation, drivers, routes, stations, filter, displayedRoutes}) => {

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const googleDirection = useSelector(selectGoogleDirection);

    const mapRef = useRef();
    const [driverTimes, setDriverTimes] = useState([]);

    const [directionStart, setDirectionStart] = useState([])
    const [directionEnd, setDirectionEnd] = useState([])
    const [arrivalTime, setArrivaltime] = useState()
    const [departureTime, setDepartureTime] = useState()
    const [transportType, setTransportType] = useState()
    const [originMarker, setOriginMarker] = useState(0)

    const [driversArray,setDriversArray ] = useState([]);
    const [linesArray,setLinesArray ] = useState([]);

    const edgePadding = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
    }

    const getVehicleMarkerImage = (type) => {

        if(type == VehicleTypes.BUS || type == VehicleTypes.TROLLEYBUS)
            return BusIcon;
        else if (type == VehicleTypes.TRAM)
            return TramIcon;

        return BusIcon
    }

    const getSizeText = (size) => {

        if(size == VehicleSizes.SMALL)
            return 'Mic';
        else if (size == VehicleSizes.NORMAL)
            return 'Normal';
        else if (size == VehicleSizes.LARGE)
            return 'Mare';

        return ''
    }

    const getStationCoord = (stop) => {

        return {
            latitude: parseFloat(stop.stop_lat),
            longitude: parseFloat(stop.stop_lon)
        }
    }

    useEffect(() => {
        if(googleDirection != null){
            setDirectionStart([{
                latitude: googleDirection.routes[0].legs[0].start_location.lat,
                longitude: googleDirection.routes[0].legs[0].start_location.lng
            }])
            setDirectionEnd([{
                latitude: googleDirection.routes[0].legs[0].end_location.lat,
                longitude: googleDirection.routes[0].legs[0].end_location.lng
            }])
            setArrivaltime(googleDirection.routes[0].legs[0].arrival_time.text)
            setDepartureTime(googleDirection.routes[0].legs[0].departure_time.text)
        }
    }, [googleDirection])

    useEffect(() => {
        if(origin) {
            setOriginMarker(1)
        } else {
            setOriginMarker(0)
        }
    }, [currentLocation,destination,origin])

    useEffect(() => {

        if(drivers) {
            switch (filter.vehiclesFilter) {
                case FilterTypes.SHOW_ALL:
                    setDriversArray(Object.values(drivers));
                    break;

                case FilterTypes.SHOW_NEARBY:
                    if(currentLocation) {
                        setDriversArray(Object.values(drivers).filter(d =>
                            d.position && getDistance({
                                    latitude: currentLocation?.latitude,
                                    longitude: currentLocation?.longitude
                                },
                                {
                                    latitude: d.position.latitude,
                                    longitude: d.position.longitude
                                }
                            ) < 1000)
                        );
                    }
                    break;

                case FilterTypes.HIDDEN:
                    setDriversArray([]);
                    break;
                case FilterTypes.ROUTE:
                    setDriversArray(Object.values(drivers).filter(d => d.line == filter.routeFilter));
                    break;
            }
        }
        else
            setDriversArray([]);


    }, [drivers, filter, currentLocation])
    function getDirection () {
        let finalDirection =[]
        if(googleDirection != null){
            let lineColor
            let dashedline

            const directionSteps = googleDirection.routes[0].legs[0].steps


            for(let i=0; i<directionSteps.length; i++){
                const type = directionSteps[i].travel_mode
                if(type === 'WALKING'){
                    lineColor = 'green'
                    dashedline = [10,10]
                } else if (type === "TRANSIT"){
                    lineColor = '#3466EF'
                    dashedline = []
                }
                let aditionalStepsExists = directionSteps[i].steps
                if(!aditionalStepsExists){
                    finalDirection.push(
                        <MapViewDirection
                            origin={`${directionSteps[i].start_location.lat},${directionSteps[i].start_location.lng}`}
                            destination={`${directionSteps[i].end_location.lat},${directionSteps[i].end_location.lng}`}
                            apikey={GOOGLE_API_KEY}
                            strokeWidth={5}
                            strokeColor={lineColor}
                            mode={type.toUpperCase()}
                            precision={'high'}
                        />
                    )
                } else {
                    let aditionalSteps = directionSteps[i].steps
                    for(let y=0; y<aditionalSteps.length; y++){
                        finalDirection.push(
                            <MapViewDirection
                                origin={`${aditionalSteps[y].start_location.lat},${aditionalSteps[y].start_location.lng}`}
                                destination={`${aditionalSteps[y].end_location.lat},${aditionalSteps[y].end_location.lng}`}
                                apikey={GOOGLE_API_KEY}
                                strokeWidth={5}
                                strokeColor={lineColor}
                                lineDashPattern={dashedline}
                                mode={type.toUpperCase()}
                                precision={'high'}
                            />
                        )
                    }
                }
            }
            fitMapView()
            return finalDirection
        } else
        return null
    }

    async function fitMapView () {
        let coords
        if(origin == null){
            coords = [
                { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                { latitude: destination.location.lat, longitude: destination.location.lng }
            ]

            mapRef.current?.fitToCoordinates(coords, {edgePadding})
        } else {
            coords = [
                { latitude: origin.location.lat, longitude: origin.location.lng },
                { latitude: destination.location.lat, longitude: destination.location.lng }
            ]
            mapRef.current?.fitToCoordinates(coords, {edgePadding})
        }
    }

    if(currentLocation != null) {
        return (
            <View flex={1}>
                <MapView
                    customMapStyle={mapStyle}
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: currentLocation?.latitude,
                        longitude: currentLocation?.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    {getDirection()}
                    {destination?.location && (
                        <Marker
                            coordinate={{
                                latitude: destination.location.lat,
                                longitude: destination.location.lng
                            }}
                            title="Destination"
                            description={destination.description}
                            identifier="destination"
                        />
                    )}

                    {origin?.location && (
                        <Marker
                            coordinate={{
                                latitude: origin.location.lat,
                                longitude: origin.location.lng
                            }}
                            title="Origin"
                            description={origin.description}
                            identifier="origin"
                            opacity={originMarker}
                        />
                    )}
                    {driversArray && routes && driversArray.filter(d => d.position).map((driver, index) => {

                            let route = routes.find(r => r.route_id == driver.line)
                            let driverRender = [];

                            driverRender.push(
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: driver?.position?.latitude,
                                        longitude: driver?.position?.longitude
                                    }}
                                >
                                    <Image
                                        source={getVehicleMarkerImage(driver.type)}
                                        style={{width: 70, height: 70, marginTop:20}}
                                        resizeMode="center"
                                        resizeMethod="resize"
                                    />
                                    <Callout tooltip>
                                        <View>
                                            <View style={[styles.bubble, {
                                                alignContent: 'center',
                                                borderColor: `#${route?.route_color}`
                                            }]}>
                                                <Text style={[styles.route, {
                                                    backgroundColor: `#${route?.route_color}`,
                                                    color: `#${route?.route_text_color}`
                                                }]}>{route?.route_short_name}</Text>
                                                <Text style={{color: 'black', position:'absolute', right:8, fontSize:15}}>{driver.nextStop?.estimatedTime}</Text>
                                                {route &&
                                                    <Text style={{fontSize:12, paddingTop:10}}>Spre: {driver.nextStop.stopName}</Text>
                                                }

                                                <Text style={{fontSize:12, paddingTop:3}}>Mărime: {getSizeText(driver.size)}</Text>

                                                {
                                                    driver.break &&
                                                    <Text style={{fontSize:12, paddingTop:3}}>În pauză: {driver.break.timeDuration} min</Text>
                                                }

                                            </View>
                                            <View style={[styles.arrowBorder, {borderTopColor: `#${route?.route_color}`}]}/>
                                            <View style={[styles.arrow, {borderTopColor: `#${route?.route_color}`}]}/>
                                        </View>
                                    </Callout>
                                    {/*<Callout tooltip={false} style={styles.calloutContainer}>*/}
                                    {/*    <Text>Size: {driver.size}</Text>*/}
                                    {/*</Callout>*/}
                                </Marker>
                            )
                            return driverRender
                        })
                    }

                    {displayedRoutes && displayedRoutes.map((route,index) => {
                            let waypoints = [];

                            JSON.parse(route.trips_array[0].geojson).coordinates.forEach(coord => waypoints.push({latitude: parseFloat(coord[1]), longitude: parseFloat(coord[0])}))
                            JSON.parse(route.trips_array[1].geojson).coordinates.forEach(coord => waypoints.push({latitude: parseFloat(coord[1]), longitude: parseFloat(coord[0])}))

                            return (
                                <Polyline key={index} coordinates={waypoints} strokeWidth={4} strokeColor={`#${route.route_color}`}/>
                            )
                        })
                    }

                    {stations && stations.map((station,index) => {

                        return (
                        <Marker
                            key={station.stop_id}
                            coordinate={{
                                latitude: parseFloat(station.stop_lat),
                                longitude: parseFloat(station.stop_lon)
                            }}
                        >
                            <Image
                                source={BusMarker}
                                style={{width: 40, height: 40}}
                                resizeMode="center"
                                resizeMethod="resize"
                            />
                            <Callout tooltip>
                                <View>
                                    <View style={[styles.bubble, {alignContent: 'center'}]}>
                                        <Text style={styles.name}>{station.stop_name}</Text>
                                    </View>
                                    <View style={styles.arrowBorder}/>
                                    <View style={styles.arrow}/>
                                </View>
                            </Callout>
                        </Marker>)
                    })}

                </MapView>
            </View>
            )
    }
    else {
        return (
            <View style={styles.map}></View>
        )
    }
}

export default Map

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    bubble: {
        // flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#279032',
        borderWidth: 6,
        padding: 15,
        width: 150,
        marginTop: 30,

    },
    name: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600'
    },
    route: {
        position: 'absolute',
        left: -2,
        top: -2,
        fontSize: 15,
        fontWeight: '600',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#279032',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#279032',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5
    },
    timeDetailsText: {
        marginHorizontal: 20,
        marginBottom: 5,
        fontSize: 20,
        fontWeight: '500'
    },
})