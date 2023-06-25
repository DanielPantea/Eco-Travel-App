import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CustomView = (props) => {

    const [image, setImage] = useState(null)
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
          props.getImage(result.assets[0].uri)
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.text}>{text}</Text> */}
            <TouchableOpacity style={styles.upload} onPress={() => pickImage()}>
                {!image && (<MaterialCommunityIcons name="cloud-upload" size={24} color="grey"/>)}
                {image && (
                    <Image 
                        source={{ uri: image}}
                        style={{width: 100, height: 50}}
                    />
                )}
            </TouchableOpacity>
        </View>
    )
}

export default CustomView

const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: 10,
        flexDirection: 'column'
    },

    text: {
        fontSize: 20,
        fontWeight: '500',

    }, 
    upload: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
    }
})