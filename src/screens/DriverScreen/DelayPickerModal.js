import {View, Text, Pressable, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Modal from 'react-native-modal'
import React, {useState} from "react";
import {delayType} from "../../models/delayType";

export default function DelayPickerModal({ isVisible, onClose, onSetDelay}) {

    const setDelayType = (type) => {
        onSetDelay(type);
        onClose();
    }

    return (
        <Modal
            isVisible={isVisible}
            animationIn={'slideInRight'}
            animationOut={'slideOutRight'}
        >
            <View style={styles.modalContent}>

                    <View style={{backgroundColor: '#ebe6e6', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={[styles.container]}
                            onPress={() => setDelayType(delayType.TRAFFIC)}
                        >
                            <Text style={[styles.text]}>Trafic</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.container]}
                            onPress={() => setDelayType(delayType.MALFUNCTION)}
                        >
                            <Text style={[styles.text]}>Defecțiuni vehicul</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.container]}
                            onPress={() => setDelayType(delayType.CRASH)}
                        >
                            <Text style={[styles.text]}>Accident Rutier</Text>
                        </TouchableOpacity>
                    </View>


                <View style={{bottom:0, backgroundColor:'#DDD8D8', height:40, width:'100%', alignItems:'flex-end', flexDirection: 'row', justifyContent:'flex-end', marginVertical: 6}}>
                    <TouchableOpacity
                        style={{backgroundColor: "#ccc8c8", width:80, borderRadius:5, padding: 10, marginStart:8, marginEnd:8, alignItems:'center', elevation:6}}
                        activeOpacity={0.8}
                        onPress={() => {onClose()}}
                    >
                        <Text style={{color:"black", fontSize: 17, fontWeight:'500'}} >Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        elevation: 5,
        backgroundColor: '#DDD8D8',
        padding: 2,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    container: {
        elevation: 5,
        padding: 20,
        alignItems: 'center',
        borderRadius: 7,
        opacity: 1,
        marginVertical: 10,
        backgroundColor: '#80D562',
        width: 250,
    },

    text: {
        fontWeight: '500',
        fontSize: 16,
        color: 'black',
    },

    inputText: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginBottom: 10,
        textAlign:'center',
        borderRadius: 5,
        fontSize: 20
    },

    customTextInput: {
        alignSelf: 'center',
        marginBottom: 3,
        fontSize: 30,
        color: '#1D5D24',
        fontWeight: '500'
    }
});