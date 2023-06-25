import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env'
import { useDispatch } from 'react-redux';
import { setDestination, setOrigin } from '../../components/navSlice';


const CustomInput = ({placeholder, set}) => {
  
  const dispatch = useDispatch();

  const setDispatch = (data, details) => {
    if(set === "Origin") {
      dispatch(setOrigin({
        location: details.geometry.location,
        description: data.description,
        place_id: data.place_id
      }));
      setDestination(null);
    } else {
      dispatch(setDestination({
        location: details.geometry.location,
        description: data.description,
        place_id: data.place_id
      }));
      setOrigin(null);
    }
  }

  return (
    <View>
        <GooglePlacesAutocomplete
            styles={{textInput: styles.inputGoogle, container: {flex: 0}}}
            placeholder={placeholder}
            fetchDetails={true}
            enablePoweredByContainer={false}
            minLength={2}
            onPress={(data, details = null) => {
                // Either setOrigin or setDestination
                setDispatch(data, details);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en', 
            }}

            debounce={400}
          />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({

    text: {
        marginBottom: 3,
        color: 'black',
        fontWeight: '400'
    },

    inputGoogle:{
      backgroundColor: 'white',
      borderColor: '#85DD66',
      paddingHorizontal: 10,
      paddingVertical: 5,
      shadowColor: 'black',
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
      borderRadius: 8,
      borderWidth: 2,
    }
})