import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { getAdminData } from '../services/adminService'

const _layout = ()=>{
  return(
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

const MainLayout = () => {
  const router = useRouter()
  const {setAuth, setUserData} = useAuth();
  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session user", session?.user);
      if (session) {
        setAuth(session?.user);
        updatedAdminData(session?.user)
        router.replace('/home')
      }else{
        setAuth(null);
        router.replace('/welcome')
      }
    })
  }, [])

  const updatedAdminData= async(user)=>{
    
    let res = await getAdminData(user?.id)
    console.log(res.success);
    
    if(res.success){
        setUserData(res.data)
    }
  }

  return (
    
      <Stack screenOptions={{headerShown: false}}/>
  )
}

export default _layout

