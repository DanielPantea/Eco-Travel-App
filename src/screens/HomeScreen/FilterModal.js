import {View, Text, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Modal from 'react-native-modal'
import Filter from "../../components/Filter/Filter";
import React from "react";

export default function FilterModal({ isVisible, children, onClose , filter, setFilter, routes}) {
    return (
        <Modal
            isVisible={isVisible}
            animationIn={'slideInRight'}
            animationOut={'slideOutRight'}
        >
            <View style={styles.modalContent}>

                <TouchableOpacity onPress={onClose}>
                    <Filter itemStyle={styles.item} filter={filter} setFilter={setFilter} routes={routes}/>
                    <View style={{bottom:0, backgroundColor:'#DDD8D8', height:55, width:'100%', alignItems:'flex-end', justifyContent: 'center'}}>
                        <TouchableOpacity
                            style={{backgroundColor: "#ccc8c8", width:80, borderRadius:5, padding: 10, marginStart:8, marginEnd:8, alignItems:'center', elevation:6}}
                            activeOpacity={0.8}
                            onPress={onClose}
                        >
                            <Text style={{color:"black", fontSize: 17, fontWeight:'500'}} >OK</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    item: {
        flex: 1,
        backgroundColor: '#ebe6e6',
        borderColor: '#827e7e',
        borderStyle: 'solid',
        borderTopWidth:0.5,
    },
});