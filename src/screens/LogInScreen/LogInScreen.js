import {View, Text, Image, KeyboardAvoidingView, StyleSheet, Alert, Platform, StatusBar} from 'react-native'
import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/bus_logo.png'
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { auth, database } from "../../../firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigation } from '@react-navigation/native';
import { ref, onValue} from '@firebase/database';


const LogInScreen = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [navigate, setNavigate] = useState(false)
  const [role, setRole] = useState('')

  const navigation = useNavigation();

  const readUserRole = (userId) => {
    const roleRef = ref(database, 'users/' + userId);
    onValue(roleRef, (snapshot) => {
      const data = snapshot.val()
      setRole(data.role)
      setNavigate(true);
    })
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          readUserRole(user.uid);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Alert.alert(error.message);
        });
  };

  // Handled after readUserRole sets navigation to true
  useEffect(() => {
    if(role === 'sofer') {
      navigation.navigate("DriverScreen")
    }
    else if (role === 'calator') {
      navigation.navigate("HomeScreen")
    }
    setNavigate(false)
  }, [navigate])

  return (
    <KeyboardAvoidingView style={styles.root}>
    <StatusBar  barStyle="light-content" translucent={true} backgroundColor={'#22802c'}/>
      <Image
        source={Logo}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appTitle}>Eco Travel</Text>
      <CustomInput placeholder="Username" value={username} setvalue={text => setUsername(text)} />
      <CustomInput placeholder="Parolă" value={password} setvalue={text => setPassword(text)} secureTextEntry={true} />
      <CustomButton text="Log In" onPress={handleSignIn} />
      <Text style={{ color: 'white', marginTop: 25, marginBottom: 15}}>__________________    SAU    __________________</Text>
      <Text style={{ color: 'white', marginBottom: 15 }}>Nu aveți cont? Creați unul acum.</Text>
      <CustomButton text="Creează Cont" onPress={() => navigation.navigate("RegisterScreen")} type="Register" />
    </KeyboardAvoidingView>
  )
}

export default LogInScreen

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    // padding: '5%',
    backgroundColor: '#279032',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1
  },

  logo: {
    marginTop: 40,
    width: '60%',
    height: '13%',
  },

  appTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    padding: 15,
    marginBottom: 20,
    textAlign: 'left'
  },
})