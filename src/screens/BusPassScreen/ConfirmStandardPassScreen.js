import { Linking, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { busPassData } from '../../models/busPassData';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/core';
import Card from '../../components/StripeCard/Card';


const ConfirmStandardPassScreen = ({route}) => {
  
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)
  const selectedId = route.params

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.details}>{busPassData[selectedId-1].details}</Text>
        <Text style={styles.price}>{busPassData[selectedId-1].price} lei</Text>
      </View>
        <TouchableOpacity
          onPress={() => Linking.openURL("http://ratt.ro/taxare/facilitati.pdf")}
          >
          <Text style={{fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline'}}   >Vezi cum poti beneficia de reduceri</Text>
        </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.buttons]} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={23} color="white" />
          <Text style={{fontSize: 20, color: 'white', fontWeight:"500"}}>Inapoi   </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => setVisible(true)}>
          <Text style={{fontSize: 20, color: 'white', fontWeight:"500"}}>   Plateste</Text>
          <Ionicons name="chevron-forward" size={23} color="white"/>
        </TouchableOpacity>  
      </View>
      <Card showCard={visible} hideCard={() => setVisible(false)} cardType="Subscription" selectedId={selectedId}></Card>
      <NavigationBar></NavigationBar>
    </View>
  )
}

export default ConfirmStandardPassScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '6%',
    justifyContent: 'flex-end',
    backgroundColor: "white",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },

  buttons: {
    flexDirection: "row",
    backgroundColor: "#279032",
    padding: 10,
    marginHorizontal: 20,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  },

  price: {
    fontSize: 50, 
    fontWeight: '500',
    color: 'black',
    padding: 10,
    marginTop: 70
  },

  details: {
    fontSize: 30, 
    fontWeight: '500',
    color: 'black',
  },

  textContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
    padding: 10, 
  },
})