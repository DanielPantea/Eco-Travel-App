import {
    Button,
    StyleSheet,
    Text,
    View,
    Platform,
    StatusBar,
    BackHandler,
    TouchableHighlight,
    TouchableOpacity, Image, Alert
} from 'react-native'
import Moment from 'moment';
import React, {useEffect, useState} from 'react'
import VehicleChooser from "./VehicleChooser";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { auth, database } from "../../../firebase"
import {getDatabase, ref, onValue, child, exists, remove, update, set, get, push, onChildAdded} from "firebase/database";
import Logo from "../../../assets/bus_logo.png";
import {VehicleTypes} from "../../models/vehicle";
import Bus from "../../../assets/bus_icon.png";
import Tram from "../../../assets/tram_icon.png";
import Trolley from "../../../assets/trolleybus_icon.png";
import {FilterTypes} from "../../models/filter";
import {useNavigation} from "@react-navigation/native";
import {signOut} from "firebase/auth";
import FilterButton from "../HomeScreen/FilterButton";
import BreakTimePickerModal from "./BreakTimePickerModal";
import * as openTransportApiService from '../../services/opentransport_api'
import * as googleApiService from '../../services/google_api'
import * as locationService from '../../services/LocationService';
import DelayPickerModal from "./DelayPickerModal";

function updateDriverData(userId, type, line, size, routeIndex) {
    update(ref(database, 'drivers/' + userId), {
        type: type,
        line: line,
        size : size,
        routeIndex: routeIndex,
    }).catch(console.error);
}

function updateDriverNextStop(userId, nextStop) {
    update(ref(database, 'drivers/' + userId), {
        nextStop: nextStop
    }).catch(console.error);
}

function updateDriverHeadway(userId, headway) {
    update(ref(database, 'drivers/' + userId), {
        headway: headway
    }).catch(console.error);
}

function updateDriverBreak(userId, timeBreak) {
    update(ref(database, 'drivers/' + userId), {
        break: timeBreak
    }).catch(console.error);
}

function updateDriverPosition(userId, position) {
    update(ref(database, 'drivers/' + userId), {
        position: position
    }).catch(console.error);
}

function updateDriverInFront(userId, driverInFrontId) {
    update(ref(database, 'drivers/' + userId), {
        driverInFrontId: driverInFrontId
    }).catch(console.error);
}

function pushDelay(userId, type, position) {
    push(ref(database, 'delays/'), {
        userId: userId,
        type: type,
        position: position
    }).catch(console.error);
}

function useBackHandler(handler) {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handler);
        };
    });
}

const DriverScreen = () => {

    const [vehicle, setVehicle] = useState({type:null,line:null,size:null,isSet:false});
    const [breakTime, setBreakTime] = useState(null);
    const [delay, setDelay] = useState(null);
    const [position, setPosition] = useState(null)
    const [driverInFrontPosition, setDriverInFrontPosition] = useState(null)
    const [titleText, setTitleText] = useState('Alege un vehiculul:')
    const [routes, setRoutes] = useState([])
    const [route, setRoute] = useState([])
    const [nextStop, setNextStop] = useState(null)
    const navigation = useNavigation();
    const [showBreakModal, setShowBreakModal] = useState(false);
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [waypoints, setWaypoints] = useState([]);
    const [routeIndex, setRouteIndex] = useState(-1);
    const [headway, setHeadway] = useState('');
    const [driverInFrontId, setDriverInFrontId] = useState(null);

    const userId = auth.currentUser.uid

    const dbRef = ref(database);

    const fetchLineWithStops = async () => {
        try {
            const data = await openTransportApiService.fetchRoutesWithStops(vehicle.line);

            let firstStop = data[0].trips_array[0].stops_array[0];

            setRoute(data[0]);

            if(nextStop == null) {
                setNextStop({
                    stopId: firstStop.stop_id,
                    stopName: firstStop.stop_name,
                    stopIndex:0,
                    latitude: firstStop.stop_lat,
                    longitude: firstStop.stop_lon,
                    direction: 0
                })
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    const locationChangeHandler = (newLocation) => {
        // Handle location data
        try {
            setPosition(newLocation.coords)
        }
        catch(error) {
            console.error(error);
        }
    };

    // Handle on enter screen
    useEffect(() => {

        // Check if driver has data in db
        get(child(dbRef, `drivers/${userId}`)).then((snapshot) => {
            if (snapshot.exists() && !vehicle.isSet) {
                setRouteIndex(snapshot.val().routeIndex);
                setNextStop(snapshot.val().nextStop);
                setVehicle({
                    type: snapshot.val().type,
                    line: snapshot.val().line,
                    size: snapshot.val().size,
                    isSet: true
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    // Handle on vehicle set
    useEffect(() => {

        if (!vehicle.isSet)
            return;

        // Get all drivers
        get(child(dbRef, `drivers/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const drivers = snapshot.val();
                // Filter only the drivers on route
                const filteredDrivers = Object.entries(drivers).filter(([, driver]) => driver.line === vehicle.line).sort(([,a], [,b]) => a.routeIndex - b.routeIndex)
                if(filteredDrivers.length > 0) {
                    setDriverInFrontId(filteredDrivers[0][0])
                }

                // If the vehicle does not have an index yet, assign it the next index after the maximum on the route
                let index;
                if (routeIndex == -1) {
                    if(filteredDrivers.length > 0) {
                        index = filteredDrivers[0][1].routeIndex + 1;
                    }

                    setRouteIndex(index);
                }
                else {
                    index = routeIndex;
                }

                updateDriverData(userId, vehicle.type, vehicle.line, vehicle.size, index);
            }
            else {
                updateDriverData(userId, vehicle.type, vehicle.line, vehicle.size, 0);
            }

            // Get the route stops and set the next stop
            if (vehicle.line != null) {
                fetchLineWithStops().catch(console.error);
            }

            // Start the location tracking
            locationService.startLocationTracking(locationChangeHandler).catch(console.error);
        }).catch((error) => {
            console.error(error);
        });

        const unsubscribe = onChildAdded(ref(database, 'drivers'), (snapshot) => {
            if(routeIndex == 0)
            {
                setDriverInFrontId(snapshot.key)
            }
        })

        // unmount listener
        return unsubscribe;
    }, [vehicle.isSet]);

    // Handle on driver in front change
    useEffect(() => {

        if(driverInFrontId == null)
            return;

        //updateDriverInFront(driverInFrontId);

        // Add a listener on the position of the driver in front
        const driverInFrontRef = ref(database, 'drivers/' + driverInFrontId);
        const unsubscribe = onValue(child(driverInFrontRef,'position'), (snapshot) => {
            if(snapshot.exists()) {
                setDriverInFrontPosition(snapshot.val());
            }
        })

        // unmount listener
        return unsubscribe;
    }, [driverInFrontId])


    // Handle on position change
    useEffect(() => {
        const fetchNextStopDistance = async () => {
            try {
                if(position == null || nextStop == null)
                        return;

                let org = `${position.latitude},${position.longitude}`
                let dest = `${nextStop.latitude},${nextStop.longitude}`

                const data = await googleApiService.fetchDirections(org, dest, 'driving', 'ro')

                let distance = data.routes[0].legs[0].distance;
                let duration = data.routes[0].legs[0].duration;

                setNextStop(prevState => ({
                    ...prevState,
                    estimatedTime: duration.text,
                    estimatedDistance: distance.text
                }));

                if (distance.value < 2) {

                     let newIndex, newDirection = nextStop.direction;
                     if(nextStop.stopIndex == route.trips_array[nextStop.direction].stops_array.length - 1)
                    {
                        newIndex = 0;
                        newDirection = !nextStop.direction;
                    }
                    else
                    {
                        newIndex = nextStop.stopIndex + 1;
                    }

                    setNextStop(
                        {
                            stopId: route.trips_array[nextStop.direction].stops_array[nextStop.stopIndex].stop_id,
                            stopName: route.trips_array[nextStop.direction].stops_array[nextStop.stopIndex].stop_name,
                            stopIndex: newIndex,
                            latitude: route.trips_array[nextStop.direction].stops_array[nextStop.stopIndex].stop_lat,
                            longitude: route.trips_array[nextStop.direction].stops_array[nextStop.stopIndex].stop_lon,
                            direction: newDirection,
                            estimatedTime: '',
                            estimatedDistance: '',
                        }
                    );
                }
            }
            catch(error) {
                console.error(error);
            }
        }

        if (position == null)
            return;

        // Update the driver position in the db
        updateDriverPosition(userId, position);

        fetchNextStopDistance().catch(console.error)
    }, [position]);

    // Handle on either driver position or driver in front position
    useEffect(() => {
        const fetchHeadway = async () => {
            try {
                if(position == null || driverInFrontPosition == null)
                    return;

                let org = `${position.latitude},${position.longitude}`
                let dest = `${driverInFrontPosition.latitude},${driverInFrontPosition.longitude}`

                const data = await googleApiService.fetchDirections(org, dest, 'driving', 'ro')

                setHeadway(data.routes[0].legs[0].distance.text)
            }
            catch(error) {
                console.error(error);
            }
        }

        if(position == null)
            return;

        if(driverInFrontPosition == null)
            return;

        fetchHeadway().catch(console.error)

    }, [position, driverInFrontPosition]);

    useEffect(() => {
        if(breakTime != null) {
            updateDriverBreak(userId, breakTime);
        }
    }, [breakTime]);

    useEffect(() => {
        if(delay != null) {
            pushDelay(userId, delay.type, position);
        }
    }, [delay]);

    useEffect(() => {
        if(nextStop != null && vehicle.isSet) {
            updateDriverNextStop(userId, nextStop);
        }
    }, [nextStop]);

    useEffect(() => {
        if(headway != null && vehicle.isSet) {
            updateDriverHeadway(userId, headway);
        }
    }, [headway]);

    // Stop Location Tracking
    const stopLocationTracking = () => {
        locationService.stopLocationTracking();
        setPosition(null)
        setNextStop(null)

        remove(ref(database, 'drivers/' + userId)).catch(console.error)

        setVehicle({type:null,line:null,size:null,isSet:false})
    }

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const data = await openTransportApiService.fetchRoutes();
                setRoutes(data);
            }
            catch(error) {
                console.error(error);
            }
        }

        fetchRoutes().catch(console.error);
    }, [])

    const onVehicleChangePress = () => {

        Alert.alert(
            "Schimbare vehiculul",
            "Ești sigur că vrei să schimbi vehiculul curent?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        stopLocationTracking();
                    }
                }
            ]
        );
    }

    const onEndShiftPress = () => {

        Alert.alert(
            "Încheiere tură",
            "Ești sigur că vrei să închei tura de astăzi?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        stopLocationTracking();
                        handleLogOut();
                    }
                }
            ]
        );
    }

    const handleLogOut = () => {
        signOut(auth).then(() =>{
            navigation.navigate("LogInScreen")
        }).catch((error) => {
        });
    }

    const handleValidateClose = () => {

        if(!vehicle.isSet)
        {
            if(vehicle.type == null);
            else if(vehicle.line == null)
            {
                setTitleText('Alege un vehicul:')

                setVehicle(prevState => ({
                    ...prevState,
                    type: null
                }));
            }
            else
            {
                setTitleText('Alege ruta:')

                setVehicle(prevState => ({
                    ...prevState,
                    line: null
                }));
            }
        }
    };

    useBackHandler(handleValidateClose);

    if(vehicle.isSet == false) {
        return (
            <View style={[styles.container]}>
                <View style={[styles.titleContainer]}><Text style={[styles.title]}>{titleText}</Text></View>
                <VehicleChooser vehicle={vehicle} setVehicle={setVehicle} routes={routes} setTitleText={setTitleText}></VehicleChooser>
            </View>
        )
    }
    else if(routes?.length > 0){
        let currentRoute = routes.find(r => r.route_id == vehicle.line);
        let vehicleIcon;
        if(vehicle.type == VehicleTypes.BUS)
            vehicleIcon = Bus;
        else if(vehicle.type == VehicleTypes.TRAM)
            vehicleIcon = Tram;
        else
            vehicleIcon = Trolley;

        return (
            <View style={[styles.container]}>
                {/*<TouchableOpacity*/}
                {/*    onPress={() => { if(!isSimulating) {foregroundSubscription?.remove(); setIsSimulating(true)} else {startForegroundUpdate(); setIsSimulating(false)}}}*/}
                {/*    style={[styles.button, {width: 70, position:'absolute', bottom:60, end:10}]}*/}
                {/*>*/}
                {/*    <Text style={styles.buttonText}>{isSimulating ? "E" : "S"}</Text>*/}
                {/*</TouchableOpacity>*/}
                <View style={[styles.titleContainer]}><Text style={{color: 'white', fontSize: 19}}>{currentRoute.trips_array[0].trip_headsign} - {currentRoute.trips_array[1].trip_headsign}</Text></View>

                <View style={styles.headway}>
                    <Text style={{textAlign: 'center', fontSize: 20, color: 'white', paddingBottom: 5}}>Headway</Text>
                    <Text style={styles.headwayValue} >{headway}</Text>
                </View>

                <Image
                    source={vehicleIcon}
                    style={styles.vehicle}
                    resizeMode="contain"
                />

                <Text style={styles.route} >{currentRoute.route_short_name}</Text>

                {
                    breakTime ? (
                        <TouchableOpacity
                            style={[styles.button, {marginTop: 190, paddingVertical: 40}]}
                            onPress={() => setBreakTime(null)}
                        >
                            <Text style={styles.buttonText}>Încheie pauza</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, {marginTop: 190, paddingVertical: 40}]}
                            onPress={() => setShowBreakModal(true)}
                        >
                            <Text style={styles.buttonText}>Ia o pauză</Text>
                        </TouchableOpacity>
                    )
                }

                <BreakTimePickerModal isVisible={showBreakModal} onClose={() => setShowBreakModal(false)} onSetBreakTime={(time, start) =>
                    setBreakTime({timeDuration: time, timeStart: Moment(start).format('DD.MM.yyyy HH:mm:ss')})
                } />

                <TouchableOpacity
                    onPress={() => onVehicleChangePress()}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Shimbă vehiculul</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShowDelayModal(true)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Raportează întârzieri</Text>
                </TouchableOpacity>

                <DelayPickerModal isVisible={showDelayModal} onClose={() => setShowDelayModal(false)} onSetDelay={(type) =>
                    setDelay({type: type})
                } />

                <TouchableHighlight style={{position: 'absolute', bottom: 0, backgroundColor:'#d13a34', width:'100%'}} underlayColor='#a63228' onPress={() => onEndShiftPress()}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{padding: 15, fontSize:20, fontWeight: 'bold'}}>Încheie tura</Text>
                        {/*<Text style={{position:'absolute', right:10, top:20, opacity: 0.4}}>{item.trips_array[0].trip_headsign} - {item.trips_array[1].trip_headsign}</Text>*/}
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

export default DriverScreen

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        backgroundColor: '#279032',
        flex: 1,
        marginVertical: 'auto'
    },

    titleContainer: {
        position: 'absolute',
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0),
        padding: 10,
        backgroundColor: '#22802c',
        alignItems: 'center',
        width: '100%'
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white'
    },

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#279032',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },

    button: {
        elevation: 5,
        padding: 20,
        alignItems: 'center',
        borderRadius: 7,
        opacity: 1,
        marginBottom: 20,
        backgroundColor: '#80D562',
        width: 250,
    },

    buttonText: {
        fontWeight: '600',
        fontSize: 20
    },

    vehicle: {
        position: 'absolute',
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + 140,
        width: '60%',
        height: '13%',
    },

    route: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + 260,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },

    headway: {
        position: 'absolute',
        top: (Platform.OS === "android" ? StatusBar.currentHeight : 0) + 50,
    },

    headwayValue: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
})