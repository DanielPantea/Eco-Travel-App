import { StyleSheet, Text, View, FlatList, Linking, TouchableOpacity, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, database } from '../../../firebase'
import { ref, onValue } from 'firebase/database'
import Card from '../../../assets/ratt.png'

const ActiveSubscriptions = () => {
    const [subscriptionsList, setSubscriptionsList] = useState()
    const [cardState, setCardState] = useState();

    useEffect(() => {
        const userId = auth.currentUser?.uid
        readSubscription(userId)
    },[])
    
    const readSubscription = (userId) => {
    const userRef = ref(database, 'users/' + userId + '/subscriptions')
    onValue(userRef, (snapshot) => {
      let data = snapshot.val()
      if(data){
        setSubscriptionsList(Object.keys(data).map((key) =>  ({
          ...data[key],
        })))
      }
    })

    if(subscriptionsList != null){
        for(let i=0; i<subscriptionsList.length; i++){
            if(subscriptionsList[i].type && subscriptionsList.state === "Vaildat"){
                setCardState("valid")
            }
        }
    }
  }

  return (
    <View style={styles.container}>
        <Image
            source={Card}
            style={styles.card}
        />
    </View>
  )
}

export default ActiveSubscriptions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '6%', 
        justifyContent: "center",
        backgroundColor: "white",
        alignItems: "center",
    },
    card: {
        width: 500,
        height: 310,

        transform: [{rotate: '90deg'}]
    }
})