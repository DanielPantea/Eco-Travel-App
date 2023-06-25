import { StyleSheet, Text, View, FlatList, Linking, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, database } from '../../../firebase'
import { ref, onValue } from 'firebase/database'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import Dialog from "react-native-dialog"

const ActiveTickestScreen = ({}) => {

  const [ticketsList, setTicketsList] = useState()
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    const userId = auth.currentUser?.uid
    readTickets(userId)
  },[])
  
  const readTickets = (userId) => {
    const userRef = ref(database, 'users/' + userId + '/tickets')
    onValue(userRef, (snapshot) => {
      let data = snapshot.val()
      if(data){
        setTicketsList(Object.keys(data).map((key) =>  ({
          ...data[key],
        })))
      }
    })
    
  }

  function calculateExpireTime(buyDate, type) {
    let currentDate = new Date()
    let date = new Date(buyDate)
    let diff
    if(type === "Bilet de o zi"){
      diff = 24 - Math.floor((currentDate - date)/(1000*60*60))
      return `${diff} ore`
    } else if (type === "Bilet 60 de minute") {
      diff = 60 -Math.floor((currentDate - date)/(1000*60))
      return `${diff} minute`
    }
  }

  function calculateDate(buyDate){
    let date = new Date(buyDate)
    return moment(date).format("DD-MM-YYYY HH:mm")
  }

  return (
    <View style={styles.container}>
        <FlatList
          data={ticketsList}
          renderItem={({item}) => 
            <TouchableOpacity 
              onPress={() => setShowQRCode(true)}
              style={styles.textContainer}
            >  
                <Text style={[styles.text,{fontWeight: '500'}]}>
                  {item.type}
                </Text>
                <Text style={styles.text}>
                  <Text style={{fontWeight: "500"}}> Data cumparari: </Text>
                  {calculateDate(item.date)}
                </Text>
                <Text style={{color: '#1CDE43'}}>
                  <Text style={{fontWeight: "500"}}>Valabilitate: </Text>
                  {calculateExpireTime(item.date,item.type)}
                </Text>
            </TouchableOpacity>
          }
          contentContainerStyle={styles.flatListContainer}
        />
        <Dialog.Container 
          visible={showQRCode} 
          contentStyle={styles.dialog}
        >
          <QRCode value='Bilet valid' size={150}/>
          <Dialog.Button 
              style={{color: "red", padding: 10}} 
              label="Inchide" 
              onPress={() => setShowQRCode(false)}
          />
        </Dialog.Container>
        {/* <NavigationBar></NavigationBar> */}
    </View>
  )
}

export default ActiveTickestScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: '6%', 
      justifyContent: "flex-end",
      backgroundColor: "white",
      alignItems: "center",
    },
    flatListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
    }, 
    textContainer: {
      width: '100%',
      alignItems: "center",
      marginVertical: 20,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: '#848484',
      padding: 10
    }, 
    text:{
      fontSize: 20
    },
    dialog: {
      alignItems: 'center',
    },
})