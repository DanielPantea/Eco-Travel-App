import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
 import { ListItem } from 'react-native-elements'
import React, {useEffect, useRef, useState} from 'react'
import {VehicleTypes, VehicleSizes} from "../../models/vehicle";
import BusIcon from "../../../assets/bus.png";
import TramIcon from "../../../assets/tram.png";
import CarIcon from "../../../assets/car.png";
import {FilterOptions, FilterTypes} from "../../models/filter";
import StationsFilter from "./StationsFilter";
import RouteFilter from "./RouteFilter";
import VehiclesFilter from "./VehiclesFilter";

const list = [
    {
        key: FilterOptions.FILTER_ROUTE,
        name: 'Route',
    },
    {
        key: FilterOptions.FILTER_VEHICLES,
        name: 'Vehicles',
    },
    {
        key: FilterOptions.FILTER_STATIONS,
        name: 'Stations',
    }
]

const Filter = ({itemStyle, filter, setFilter, routes}) => {

    const [filterOption, setFilterOption] = useState(FilterOptions.DEFAULT);

    const getRouteFilterText = (route_id) =>
    {
        if(route_id == 0) {
            return 'Hidden';
        }
        else if(route_id == 1) {
            return 'Show All';
        }
        else
            return routes.find(r => r.route_id == route_id).route_long_name;
    }

    const getFilterText = (item) => {

        let filterType;

        if(item.name == 'Route')
        {
            return getRouteFilterText(filter.routeFilter)
        }
        else if(item.name == 'Vehicles')
            filterType = filter.vehiclesFilter;
        else if(item.name == 'Stations')
            filterType = filter.stationsFilter;

        if(filterType == FilterTypes.SHOW_ALL)
            return 'Show All';
        else if (filterType == FilterTypes.SHOW_NEARBY)
            return 'Show Nearby';
        else if (filterType == FilterTypes.HIDDEN)
            return 'Hidden';
        else if (filterType == FilterTypes.ROUTE)
            return 'Show on Selected Route';

        return ''
    }

    const onFilterSelect = (option, type) => {

        if(option == FilterOptions.FILTER_VEHICLES) {
            setFilter(prevState => ({
                ...prevState,
                vehiclesFilter: type,
            }));
        }
        else if(option == FilterOptions.FILTER_STATIONS) {
            setFilter(prevState => ({
                ...prevState,
                stationsFilter: type,
            }));
        }
        else if(option == FilterOptions.FILTER_ROUTE) {
            setFilter(prevState => ({
                ...prevState,
                routeFilter: type,
            }));
        }

        setFilterOption(FilterOptions.DEFAULT);
    }

    switch (filterOption) {
        case FilterOptions.DEFAULT:
            return (
                <FlatList style={{width:'100%'}}
                          data={list}
                          renderItem={({ item, index }) => {
                              return (
                                  <TouchableHighlight onPress={() => setFilterOption(item.key)}>
                                      <View style={itemStyle}>
                                          <Text style={{padding: 20, fontSize:16}}>{item.name}</Text>
                                          <Text style={{position:'absolute', right:10, top:20, opacity: 0.4}}>{getFilterText(item)}</Text>
                                      </View>
                                  </TouchableHighlight>
                              )
                          }}
                />
            )
        case FilterOptions.FILTER_ROUTE:
            return (
               <RouteFilter itemStyle={itemStyle} routes={routes} onSelected={(route_id) => onFilterSelect(FilterOptions.FILTER_ROUTE, route_id)}/>
            )
        case FilterOptions.FILTER_VEHICLES:
            return (
                <VehiclesFilter itemStyle={itemStyle} onSelected={(type) => onFilterSelect(FilterOptions.FILTER_VEHICLES, type)}/>
            )
        case FilterOptions.FILTER_STATIONS:
            return (
                <StationsFilter itemStyle={itemStyle} onSelected={(type) => onFilterSelect(FilterOptions.FILTER_STATIONS, type)}/>
            )
    }

}

export default Filter

const styles = StyleSheet.create({

});