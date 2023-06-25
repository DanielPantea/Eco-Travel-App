import { View, Text, StyleSheet, TouchableOpacity , Image, BackHandler} from 'react-native'
import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Logo from '../../../assets/bus_logo.png'
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';

const AccountDetailsScreen = () => {

  const [user, setUser] = useState(null)

  const navigation = useNavigation();
  const handleLogOut = () => {
    signOut(auth).then(() =>{
      navigation.navigate("LogInScreen")
    }).catch((error) => {
    });
  }

  useEffect(() => {
    setUser(auth.currentUser?.email)
  }, [])

  return (
    <View style={styles.container}>

    <SafeAreaView style={styles.topContainer}>
        <Image
          source={Logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.buttonsContainer}>
          <CustomButton text={`User: ${user}`} type={'list'}/>
          <CustomButton text={'Tichete valide'} type={'list'} onPress={ ()=>  navigation.navigate("ActiveTicketScreen")}/>
          <CustomButton text={'Abonamente'} type={'list'} onPress={ ()=>  navigation.navigate("ActiveSubscriptions")}/>
          <View style={{justifyContent: 'flex-end', flex: 1}}>
            <CustomButton text={'LogOut'} type={'logout'} onPress={() => handleLogOut()}/>
          </View>
        </View>
    </SafeAreaView>
        < NavigationBar></NavigationBar>
    </View>
  )
}

export default AccountDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#279032'
  },

  topContainer: {
    flex: 1,
    justifyContent:'flex-start'
  },  

  buttonsContainer: {
    flex: 1,
    justifyContent:'flex-start',
    backgroundColor: '#279032',
  },

  logo: {
    marginTop: 40,
    marginBottom: 10,
    width: '100%',
    height: '15%',
    justifyContent:'flex-start',
    alignSelf:'center',
  },
  border: {
    borderTopWidth: 0.5,
    borderColor: 'white'
  },
  listButtons:{
    backgroundColor: '#80D562',
    paddingVertical: 5,
  },

  logoutButton: {
    backgroundColor: '#D42222',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black'
  },

})