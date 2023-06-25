import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect} from 'react'
import CustomButton from './CustomButton'
import { useNavigation, useRoute } from '@react-navigation/native'

const Test = () => {

    const navigation = useNavigation();
    return (
        <View style={styles.menuBar}>
            <CustomButton text="Bilete" icon='ticket' type="FontAwesome" onPress={() => navigation.navigate("TicketScreen")}></CustomButton>
            <CustomButton text="Abonamente" icon='md-card-outline' type="Ionicons" onPress={() => navigation.navigate("BusPassScreen")} ></CustomButton>
            <CustomButton text="Harta" icon='md-map-sharp' type="Ionicons" onPress={() => navigation.navigate("HomeScreen")}></CustomButton>
            <CustomButton text="Cont" icon='account-circle' type="MaterialIcons" onPress={() => navigation.navigate("AccountDetailsScreen")}></CustomButton>
      </View>
    )
}

export default Test

const styles = StyleSheet.create({
    menuBar: {
      padding: 5, 
      flexDirection: 'row',
      backgroundColor: "#F3F3F3",
      borderTopColor: 'grey',
      borderTopWidth: 0.5
    },
})