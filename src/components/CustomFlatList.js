import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { auth, database } from "../../firebase"
import { ref, onValue } from 'firebase/database';
import { busPassData } from '../models/busPassData';
import { setTicketsId } from './navSlice';

const CustomFlatList = ({data, isTicket, showToast, showCard}) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState(null)
    const [nrOfActiveTickets, setNrOfActiveTickets] = useState(0)

    useEffect(() => {
        const userId = auth.currentUser?.uid
        setNrOfActiveTickets(readAvailableTickets(userId))
    },)

    const readAvailableTickets = (userId) => {
        let nrOfActiveTickets = 0;
        const userRef = ref(database, 'users/' + userId + '/tickets/')
        onValue(userRef, (snapshot) => {
            snapshot.forEach(() => {
                nrOfActiveTickets++;
            })
        })
        return nrOfActiveTickets;
    }

    const Item = ({item, onPress, borderColor, textColor, elevation, borderWidth, shadowOpacity}) => (
        <TouchableOpacity 
          onPress={onPress}
          style={[styles.item, borderColor, elevation, borderWidth, shadowOpacity]}
          activeOpacity={0.7}
        >
          <Text style={[styles.itemText, textColor]}>{item.name}</Text>
        </TouchableOpacity>
    );
    
    const renderItem = ({ item }) => {
        const borderColor = item.key === selectedId ? "#196220" : null;
        const color = item.key === selectedId ? "black" : "grey";
        const elevation = item.key === selectedId ? 10 : 0;
        const shadowOpacity = item.key === selectedId ? 0.3 : 0;
        const borderWidth = item.key === selectedId ? 2 : 0;
        
        return (
            <Item
                item={item}
                onPress={() => {setSelectedId(item.key);dispatch(setTicketsId(item.key));}}
                borderColor={{ borderColor }}
                elevation={{ elevation }}
                shadowOpacity={{ shadowOpacity }}
                textColor={{ color }}
                borderWidth={{ borderWidth }}
            />
        );
    };

    const handleConfirm = () => {
        return busPassData[selectedId-1].name === 'reduceri/gratuitati' ? navigation.navigate("ConfirmStudentPassScreen",selectedId) : navigation.navigate("ConfirmStandardPassScreen",selectedId) 
    }

    const ticketsAvailability = () => {
        if(isTicket){
            if(nrOfActiveTickets){
                return (
                    <TouchableOpacity onPress={() => navigation.navigate("ActiveTicketScreen")}> 
                        <Text style={styles.activeTickets}> 
                            Ai {nrOfActiveTickets} bilete 
                            <Text style={{color: "green"}}> active</Text>
                        </Text>
                    </TouchableOpacity>
                ) 
            } else {
                return (
                    <Text style={styles.inactiveTickets}> Nu aveti bilete active </Text>
                )
            }
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                extraData={selectedId}
                contentContainerStyle={styles.buttonsContainer}
            />
            {selectedId &&  data[selectedId-1].price != '0' && (
                <Text style={styles.price}>{data[selectedId-1].price} lei</Text>
            )}
            {   
                selectedId && 
                <TouchableOpacity 
                    style={styles.chooseButton}   
                    onPress={isTicket ? showCard : handleConfirm}
                >
                    <Text style={styles.chooseText}>{isTicket ? "Cumpara" : "Confimra"}</Text>
                </TouchableOpacity> 
                ||  
                !selectedId && 
                <TouchableOpacity 
                    style={[styles.chooseButton,{backgroundColor: "#DDD8D8"}]} 
                    activeOpacity={0.8}
                    onPress={showToast}
                >
                    <Text style={[styles.chooseText, {color:"black"}]} >{isTicket ? "Cumpara" : "Confimra"}</Text>
                </TouchableOpacity> 
            }
            {ticketsAvailability()}
            
        </View>
    )
}

export default CustomFlatList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '6%', 
        justifyContent: 'flex-end',
        backgroundColor: "white",
        alignItems: "center",
    },
    
    buttonsContainer: {
        alignItems: "center",
        // backgroundColor: 'grey',
    },

    chooseButton: {
        backgroundColor: "#279032",
        paddingHorizontal: '15%',
        paddingVertical:'5%',
        alignItems: "center",
        borderRadius: 20,
        marginBottom: 20,
        marginTop: 15,
        elevation: 4,
        shadowOpacity: 0.2
    },

    chooseText: {
        color: "white",
        fontSize: 20,
        fontWeight: "600"
    },
    
    item: {
        backgroundColor: "#EFEAEA",
        width: 300,
        maxWidth: '80%',
        paddingVertical: 18,
        alignItems: "center",
        borderRadius: 20,
        marginTop: 30,
    },

    itemText: {
        fontSize: 16, 
        fontWeight: '500'
    },

    price: {
        fontSize: 20, 
        fontWeight: '500',
        color: 'black',
        padding: 10,
    },
    activeTickets: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
        padding: 10
    },  

    inactiveTickets: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
        color: "red",
        padding: 10
    },
})