import { Alert, ScrollView, Pressable,StyleSheet, TouchableOpacity,Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from "../../components/SceenWrapper";
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js'
import { theme } from '../../constants/theme.js'
import BackButton from '../../components/BackButton.jsx'
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Button from '../../components/Button.jsx'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import Loading from '../../components/Loading.jsx';
import Input from '../../components/Input.jsx';
import { courses } from '../../constants/data.js';
const job=()=>{
    const { setAuth, user } = useAuth()
    const router = useRouter()
  
  
    async function signOut() {
  
      const { error } = await supabase.auth.signOut()
      console.log(error);
  
      if (error) {
        Alert.alert('Error', error.message)
      }
    }
  
    const handleLogout = async () => {
      Alert.alert('Confirm', 'Are you sure you want to log out?', [
        {
          text: 'Cancel',
          onPress: () => console.log("logout cancel"),
          style: 'cancel'
  
        }, {
          text: 'Logout',
          onPress: () => signOut(),
          style: 'destructive'
        }
      ])
    }
    return (
      <ScreenWrapper bg="#000">
        <StatusBar style='light' />
        <View style={styles.container}>
        <View style={styles.header}>
         <BackButton color="white" size={35} />
          <View style={styles.icon}>
            <Pressable onPress={handleLogout}>
              <Feather name="log-out" color="white" size={24} />
            </Pressable>
          </View>
        </View>
          
          <View>
            <Text style={styles.heading}>Send Notification</Text>
  
          </View>
          <ScrollView>
            <View style={styles.content}>
              {courses.map((value, i) => {
                return (
  
                  <TouchableOpacity key={i} style={styles.cards}
                    onPress={() => {
                      router.push(`/send/send?folder=${encodeURIComponent(value.title)}`)
                    }}
                  >
                    <Text style={styles.cardsText}>{value.title}</Text>
                  </TouchableOpacity>
                )
  
              })}
            </View>
          </ScrollView>
        </View>
     
  
      </ScreenWrapper>
    )
}

export default job;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    heading: {
      color: theme.colors.textLight,
      fontSize: hp(3),
      width: wp(80),
      marginVertical: hp(3),
      textAlign: 'left',
      marginLeft: wp(4)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: wp(3),
      marginTop: hp(2)
    },
    logo: {
      height: 60,
      width: 150,
      backgroundColor: 'rgba(228, 222, 222, 0.91)',
      borderRadius: 10,
    },
    icon: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between'
    },
    content: {
      flex: 1,
      alignItems: 'center'
    },
    cards: {
      flex: 1,
      marginVertical: hp(3),
      paddingVertical: hp(5),
      borderRadius: theme.radius.xl,
      borderColor: theme.colors.primary,
      borderWidth: 2,
      backgroundColor: '#40916c',
      width: wp(81),
      borderCurve: 'continuous',
      alignItems: 'center',
      shadowColor: theme.colors.dark,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    card1: {
      position: 'absolute',
      top: -80,
      width: wp(40),
      height: hp(40),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '90deg' }]
    },
    cardsText: {
      fontSize: hp(4),
      fontWeight: theme.fonts.semibold,
      color: theme.colors.textDark,
    },
    background: {
      position: 'absolute',
      height: hp(150),
      width: wp(100),
    }
  })



