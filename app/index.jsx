import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Loading from '../components/Loading';
// import Home from './(main)/home'
const index = () => {
    const router = useRouter();
  return (
   <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
    <Loading/>
    {/* <Home /> */}
   </View>
  )
}

export default index

const styles = StyleSheet.create({})