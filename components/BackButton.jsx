import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';

const BackButton = ({size=26, route, color, style}) => {
    const router = useRouter()
  return (
    <Pressable onPress={()=>{
        if (route === 'home') {
            router.push('welcome')
        }else{
        router.back()
        }
        }} style={style}>
      <Entypo name="chevron-left" size={size} color={color} />
    </Pressable>
  )
}

export default BackButton

