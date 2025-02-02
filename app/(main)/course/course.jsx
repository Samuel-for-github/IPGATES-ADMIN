import { Alert, ScrollView, Pressable,StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { decode } from 'base64-arraybuffer';
import ScreenWrapper from "../../../components/SceenWrapper";
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js'
import { theme } from '../../../constants/theme.js'
import BackButton from '../../../components/BackButton.jsx'
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../../components/Button.jsx'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import Loading from '../../../components/Loading.jsx';
import Input from '../../../components/Input.jsx';
import { courses } from '../../../constants/data.js';
const course=()=>{
    const { setAuth, user } = useAuth()
    const router = useRouter()
    const {folder} = useLocalSearchParams();
    const [uri, setUri] = useState(null)
    const [fileName, setFileName] = useState('')  // New state for file name
    const [loading, setLoading] = useState(false);




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
   
    const end = async () => {
        setLoading(true); // Set loading to true when the action starts
        try {
            const { data, error } = await supabase
                .from('course')
                .select('*')
                .eq('c_name', folder)
                .eq('request', 'Accepted');
    
            if (error) {
                console.log('got error', error);
                setLoading(false); // Set loading to false if there is an error
                return { success: false, message: error.message };
            }
            console.log("end", data);
            data.map(async (val, i) => {
                const { data, error } = await supabase.from('completedStudent').insert({ "course_name": val.c_name, "student_id": val.student_id });
                if (error) {
                    console.error("Error inserting data:", error.message);
                } else {
                    console.log("Inserted data:", data);
                }
            });
            const { data1, error1 } = await supabase
  .from('course')
  .update({ "request": "Completed" }) // Set the values you want to update
  .eq('c_name', folder) // Condition to identify the row(s)
  .eq('request', 'Accepted');
            setLoading(false); // Set loading to false when the action is complete
            return { success: true, data1 };
        } catch (error) {
            console.log('got error', error);
            setLoading(false); // Set loading to false if there is an exception
            return { success: false, message: error.message };
        }
        
    };
    useEffect(() => {
    //   end()
    }, [folder])
    


    return (
    <ScreenWrapper bg="#000">
        <StatusBar style="light" />
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
                <Text style={styles.heading}>Configure {folder} Course</Text>
            </View>
            <ScrollView>
                <View style={styles.content}>
                    <View>
                        <Button
                            buttonStyle={styles.button}
                            title={loading ? 'Ending Course...' : `End ${folder} Course`} // Display loading text
                            onPress={end}
                            disabled={loading} // Disable button while loading
                        />
                    </View>
                    {/* Display loading indicator when loading */}
                </View>
            </ScrollView>
        </View>
    </ScreenWrapper>
);
}

export default course;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, 
        paddingHorizontal: wp(4),
    },
    heading: {
        color: theme.colors.textLight,
        fontSize: hp(3),
        fontWeight: 'bold',
        marginVertical: hp(3),
        width: wp(90),
        textAlign: 'left',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    icon: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: hp(5),
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
        borderRadius: theme.radius.md,
        marginVertical: hp(1.5),
        width: wp(80),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        width: wp(80),
        paddingHorizontal: wp(4),
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'white',
        marginTop: hp(1),
        color: theme.colors.textDark,
    },
    loadingContainer: {
        marginTop: hp(2),
    },
});


