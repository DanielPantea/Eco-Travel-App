import {StyleSheet, Text, View, Image, Platform, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Map from "../../components/Map"
import CustomInput from './CustomInput'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { selectDestination, selectOrigin, selectGoogleDirection, setGoogleDirection } from '../../components/navSlice'
import { useDispatch, useSelector } from 'react-redux'
import { auth, database } from '../../../firebase';
import {onValue, ref, set, push, child, update} from 'firebase/database';
import FilterButton from "./FilterButton";
import { Modal } from 'react-native'
import {FilterTypes} from "../../models/filter";
import FilterModal from "./FilterModal";
import { setDestination, setOrigin } from '../../components/navSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment/moment';
import * as openTransportApiService from '../../services/opentransport_api'
import * as googleApiService from '../../services/google_api'
import * as locationService from '../../services/LocationService';

const HomeScreen = () => {

    const destination = useSelector(selectDestination);
    const origin = useSelector(selectOrigin);
    const googleDirection = useSelector(selectGoogleDirection);
    const dispatch = useDispatch();

    const [location, setLocation] = useState(null);
    const [showDetails,setShowDetails] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [linesAll, setLinesAll] = useState([]);
    const [selectedLine, setSelectedLine] = useState([]);
    const [stations, setStations] = useState([]);
    const [stationsAll, setStationsAll] = useState([]);
    const [arrivalTime, setArrivalTime] = useState();
    const [departureTime, setDepartureTime] = useState();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({
        routeFilter: 0,
        vehiclesFilter: FilterTypes.SHOW_NEARBY,
        stationsFilter: FilterTypes.SHOW_NEARBY
    });

    let routeDetails = []

    const userId = auth.currentUser?.uid

    // Fetch Drivers from db
    useEffect(() => {
      const fetchDrivers = async () => {
          try {
            const driversRef = ref(database, 'drivers/');
            onValue(driversRef, (snapshot) => {
                setDrivers(snapshot.val());
            });
          }
           catch(error) {
              console.error(error);
          }
      }

      fetchDrivers().catch(console.error);
    }, [])

    // Fetch Destination Direction
    useEffect(() => {
        const fetchDirections = async () => {
            try {
                let org
                if(origin)
                    org = `${origin.location.lat},${origin.location.lng}`
                else
                    org = `${location?.latitude},${location?.longitude}`

                const data = await googleApiService.fetchDirectionsByPlaceId(org, destination, 'transit', 'ro')

                dispatch(setGoogleDirection(data))
            }
            catch(error) {
                console.error(error);
            }
        }

        if(destination)
            fetchDirections().catch(console.error);
    }, [location,destination,origin])

    // Fetch Routes
    useEffect(() => {
        const fetchLines = async () => {
            try {
                const data = await openTransportApiService.fetchRoutes();
                setLinesAll(data);
            }
            catch(error) {
                console.error(error);
            }
        }

        fetchLines().catch(console.error);
    }, [])

    // Fetch Stops
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const data = await openTransportApiService.fetchStops();
                setStationsAll(data);
            }
            catch(error) {
                console.error(error);
            }
        }

        fetchStations().catch(console.error);
    }, [])

    // Handle Stops filtering
    useEffect(() => {
        const setDisplayedStations = async () => {
            if(filter.stationsFilter == FilterTypes.SHOW_ALL) {
                setStations(stationsAll);
            }
            else if(location && filter.stationsFilter == FilterTypes.SHOW_NEARBY) {
                const data = await openTransportApiService.fetchNearbyStops(location?.latitude, location?.longitude, 1000);
                setStations(data);
            }
            else {
                setStations([]);
            }
        }

        setDisplayedStations().catch(console.error);
    }, [filter.stationsFilter, location]);

    // Handle Routes filtering
    useEffect(() => {
        const fetchLineWithShape = async () => {
            try {
                const data = await openTransportApiService.fetchRoutesWithShapes(filter.routeFilter);
                setSelectedLine(data);
            }
            catch(error) {
                console.error(error);
            }
        }

        if(filter.routeFilter == 0) {
            setSelectedLine([]);
        }
        else {
            fetchLineWithShape().catch(console.error);
        }

    }, [filter.routeFilter]);

    // Location Tracking
    useEffect(() => {
        const locationChangeHandler = (newLocation) => {
            // Handle location data
            try {
                setLocation(newLocation?.coords);
            }
            catch(error) {
                console.error(error);
            }
        };

        // Start the location tracking
        locationService.startLocationTracking(locationChangeHandler).catch(console.error);

        return () => {
            // Stop the location tracking when signing out
            locationService.stopLocationTracking();
        };
    }, []);

    // Handle Google Direction
    useEffect(() => {
        if(googleDirection != null){
            setArrivalTime(googleDirection.routes[0].legs[0].arrival_time.text)
            setDepartureTime(googleDirection.routes[0].legs[0].departure_time.text)
        }
    }, [googleDirection])

    useEffect(() => {

        if(destination || origin){
            setVisible(true)
        }
    }, [destination, origin])

    function showFlatList(){

        return (
            <FlatList
                data={routeDetails}
                renderItem={({item}) =>
                    <View style={{flexDirection: 'row',marginBottom: 5}}>
                        <Text style={{marginRight: 1}}>{item.arrivalTime}</Text>
                        {item.travel_mode && (
                            <View style={{flexDirection: 'column', alignItems:'center',paddingHorizontal:4}}>
                                <Text style={[{ fontSize: 15 }, item.travel_mode==="WALKING" ? styles.greenDot:null]}>{`\u25CF`}</Text>
                                <View style={[styles.verticleLine,item.travel_mode==="WALKING" ? styles.greenVerticalLine:null]}></View>
                            </View>
                        )}
                        {!item.travel_mode && (
                            <View style={{flexDirection: 'column', alignItems:'center',paddingHorizontal:4}}>
                                <Text style={{ fontSize: 25}}>{`\u29BF`}</Text>
                            </View>
                        )}

                        {item.travel_mode && (
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                    {(item.travel_mode === "WALKING") && (
                                        <FontAwesome5 name="walking" size={24} color="black"/>
                                    )}
                                    {(item.travel_mode === "TRANSIT") && (
                                        <Image
                                            source={{ uri: item.uri}}
                                            style={styles.logo}
                                        />
                                    )}
                                    <Text style={{fontSize: 19}}>{item.vehicleName}</Text>
                                    <Text style={{marginLeft: 10}}>{item.duration}</Text>
                                </View>
                                <Text style={{fontWeight:'500'}}>{item.instructions}</Text>
                            </View>
                        )}
                        {!item.travel_mode && (
                            <View>
                                <Text style={{fontWeight:'500'}}>{item.instructions}</Text>
                            </View>
                        )}
                    </View>
                }
                contentContainerStyle={styles.flatListContainer}
            />
        )
    }

    const directionDetailsView = () => {
        let routeInfo = []

        if(googleDirection != null){
            const directionSteps = googleDirection.routes[0].legs[0].steps
            let time = departureTime
            for(let i=0; i<directionSteps.length; i++){
                let travel_mode = directionSteps[i].travel_mode;
                let uri = `http:${directionSteps[i].transit_details?.line?.vehicle?.icon}`
                let vehicleName = directionSteps[i].transit_details?.line?.short_name
                let vehicleDepartureTime = directionSteps[i].transit_details?.departure_time.text
                if(i > 0){
                    if(vehicleDepartureTime != null){
                        time = moment(vehicleDepartureTime,"HH:mm").format("HH:mm")
                    } else {
                        time = moment(time,"HH:mm").add((moment(directionSteps[i-1].duration.text,"mm").format("mm")),'minutes').format("HH:mm")
                    }
                }
                routeDetails.push({
                    key: i,
                    arrivalTime: time,
                    vehicleName: vehicleName,
                    duration: directionSteps[i].duration.text,
                    instructions: directionSteps[i].html_instructions,
                    travel_mode: travel_mode,
                    uri: uri
                })
                if(travel_mode === 'WALKING'){
                    routeInfo.push(
                        <View style={styles.directionItemsContainer}>
                            <FontAwesome5 name="walking" size={24} color="black" />
                            <Text>Mergi</Text>
                        </View>
                    )
                } else {
                    routeInfo.push(
                        <View style={styles.directionItemsContainer}>
                            <Image
                                source={{ uri: uri}}
                                style={styles.logo}
                            />
                            <Text style={{textTransform: 'uppercase'}}>
                                {directionSteps[i].transit_details.line.vehicle.name} {directionSteps[i].transit_details.line.short_name}
                            </Text>
                        </View>
                    )
                }
                if(i != directionSteps.length-1){
                    routeInfo.push(
                        <MaterialIcons style={styles.directionItemsContainer} name="arrow-forward-ios" size={24} color="black" />
                    )
                }
            }
            routeDetails.push({
                key: directionSteps.length,
                arrivalTime: arrivalTime,
                instructions: "Ati ajuns la destinatie",
                travel_mode: null,
                uri: null
            })

            return (
                <View flex={1}>
                    <View style={styles.departureTime}>
                        <Text style={styles.departureTimeText}>Plecare la {departureTime}</Text>
                    </View>
                    <Text style={{marginLeft: 30, marginBottom: 5}}>Durata : {googleDirection.routes[0].legs[0].duration.text}</Text>
                    <View style={styles.directionDetails}>
                        {routeInfo}
                    </View>
                    <TouchableOpacity
                        style={{flexDirection:'row', paddingHorizontal: 20, marginTop: 5,alignItems:'center'}}
                        onPress={() => setShowDetails(!showDetails)}
                    >
                            {!showDetails && (
                                <MaterialIcons style={styles.directionItemsContainer} name="arrow-forward-ios" size={20} color="green" />
                            )}
                            {showDetails && (
                                <MaterialIcons style={styles.directionItemsContainer} name="keyboard-arrow-down" size={30} color="green" />
                            )}
                        <Text style={styles.showDetailsText}>
                            Vezi detalii
                        </Text>
                    </TouchableOpacity>
                    {showDetails && showFlatList()}
                    <TouchableOpacity style={styles.showRouteButton} onPress={() => setVisible(false)}>
                        <Text style={{fontSize: 18,fontWeight:'500',color:'white'}}>Vezi ruta</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    return (
    <SafeAreaView style={styles.container}>
        <View style={{padding: 15}}>
            {destination?.location && (
                <CustomInput
                    placeholder="Locatie curenta"
                    set="Origin"
                />
            )}
            <CustomInput
                placeholder="Destinatie"
                set="Destination"
            />
        </View>
        {visible && directionDetailsView()}

        {!visible && (
            <Map styles={styles.map} currentLocation={location} drivers={drivers} stations={stations} filter={filter} routes={linesAll} displayedRoutes={selectedLine}/>
        )}

        {!visible && linesAll &&
            <FilterButton onPress={() => setShowFilterModal(true)} />
        }

        <FilterModal isVisible={showFilterModal} onClose={() => setShowFilterModal(false)} filter={filter} setFilter={setFilter} routes={linesAll}>

        </FilterModal>
        < NavigationBar></NavigationBar>
    </SafeAreaView>
    )

}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'white'
    },
    clear: {
        backgroundColor: '#279032',
        alignSelf:'center',
        marginTop:15,
        marginStart:3,
        borderRadius:6,
        alignContent: 'center',
        justifyContent: 'center',
        height:43,
        paddingHorizontal: 10,
    },
    directionDetails:{
        flexDirection: 'row',
        paddingHorizontal: 30,
    },
    directionItemsContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10
    },
    logo:{
        width: 30,
        height: 25,
    },
    departureTime: {
        paddingHorizontal: 30,
        borderBottomWidth: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10
    },
    departureTimeText:{
        fontWeight: '500',
        fontSize: 20,
        marginBottom: 5,
    },
    showDetailsText:{
        fontWeight: '500',
        color: 'green',
        fontSize: 25,
        alignItems: 'center'
    },
    flatListContainer: {
        padding: 15,
    },
    verticleLine: {
        flex: 1,
        width: 3,
        backgroundColor: '#909090',
    },
    greenVerticalLine: {
        backgroundColor: 'green'
    },
    greenDot:{
        color: 'green'
    },
    showRouteButton: {
        padding: 10,
        width: 180,
        height: 60,
        marginHorizontal: 20,
        marginVertical: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#279032",
        borderRadius: 20,
        elevation: 4,
        shadowOpacity: 0.2
    }
})