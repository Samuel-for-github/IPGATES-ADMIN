import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from '../../components/SceenWrapper.jsx'
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../../constants/theme.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '../../components/Loading.jsx';

const Home = () => {
  const { setAuth, user } = useAuth()
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [isTeacher, setIsTeacher] = useState(false)
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

  // Check if the user is a teacher or admin (assuming you have a role property in user data)
useEffect(() => {
  console.log("home",user.role);
  if(user.role=="teacher"){
    setIsTeacher(true)
  }
  // const isTeacher = user?.role === 'Teacher'; // Adjust this based on your actual role structure

  // console.log("role",isTeacher);
}, [user])

  

  return (
    <ScreenWrapper bg="#000">
      <StatusBar style='light' />
      <View style={styles.container}>
        <LinearGradient colors={['rgb(218,255,185)', '#a990eb']} style={styles.top}>
          <View style={styles.header}>
            <Text style={styles.headingText}>HI, {user && user.a_name}</Text>
            <View style={styles.icon}>
              <Pressable>
                <Ionicons name="notifications-outline" size={24} color="black" />
              </Pressable>
              <Pressable onPress={handleLogout}>
                <Feather name="log-out" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
        <ScrollView>
          <View style={styles.content}>
            {/* Render course navigation only if the user is not a teacher */}
            {!isTeacher && (
              <TouchableOpacity style={styles.navigate} onPress={() => router.push('/course')}>
                <Text style={styles.card}>Courses</Text>
              </TouchableOpacity>
            )}
            {/* Render verify navigation only if the user is not a teacher */}
            {!isTeacher && (
              <TouchableOpacity style={styles.navigate} onPress={() => router.push('/verify')}>
                <Text style={styles.card}>Verify Student for Course</Text>
              </TouchableOpacity>
            )}
            {/* Render notes and attendance for both admin and teacher */}
            <TouchableOpacity style={styles.navigate} onPress={() => router.push('/notes')}>
              <Text style={styles.card}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigate} onPress={() => router.push('/attendance')}>
              <Text style={styles.card}>Attendance</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  navigate: {
    alignItems: 'center',
    height: hp(25),
    justifyContent: 'center',
    paddingVertical: hp(2),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: wp(4),
    width: wp(45)
  },
  card: {
    color: 'white',
    fontSize: hp(3),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  top: {
    marginHorizontal: wp(3),
    borderRadius: theme.radius.md,
    gap: hp(10),
    paddingBottom: hp(3)
  },
  headingText: {
    fontSize: hp(3),
    color: 'black'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2)
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(95),
    height: hp(100),
    gap: wp(4),
    marginTop: wp(5),
    marginLeft: wp(2),
    justifyContent: 'center',
  },
})
