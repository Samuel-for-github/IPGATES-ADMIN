import { Alert, ScrollView, Pressable,StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
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
const note=()=>{
    const { setAuth, user } = useAuth()
    const router = useRouter()
    const {folder} = useLocalSearchParams();
    const [uri, setUri] = useState(null)
    const [fileName, setFileName] = useState('')  // New state for file name
    const [loading, setLoading] = useState(false);

    const select = async () => {
        let result = await DocumentPicker.getDocumentAsync();
        let file = result.assets[0].uri;
        console.log(file);
        setUri(file);
        // console.log(uri);
        
    }

    const upload = async () => {
        if (!fileName.trim()) {
            Alert.alert('Error', 'Please provide a file name');
            return;
        }

        setLoading(true)

        const fileBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64'
        })
        let fileData = decode(fileBase64)
        console.log(fileData);

        const { data, error } = await supabase
            .storage
            .from('notes')
            .upload(`public/${folder}/${fileName}`, fileData, {
                contentType: 'application/pdf'
            })
        if (error) {
            console.log("file upload error", error);
            setLoading(false)
            return { success: false }
        }
        console.log(data);
        if (data) {
            setFileName("")
            setLoading(false)
            Alert.alert('Success', 'File uploaded successfully');
        }
    }
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
            <Text style={styles.heading}>Upload {folder} Notes</Text>
  
          </View>
          <ScrollView>
            <View style={styles.content}>
              <Button
                            buttonStyle={styles.button}
                            title="Select Document"
                            onPress={select}
                        />
                        
                        {uri && (
                            <Input
                                color="black"
                                // fontSize={hp(3)}
                                value={fileName}
                                onChangeText={setFileName}  // Set file name
                                containerStyles={styles.input}
                                placeholder="Enter file name"
                            />
                        )}
                        {loading ? (
                            <Loading />
                        ) : (
                            <Button
                                buttonStyle={styles.button}
                                title="Upload Document"
                                onPress={upload}
                            />
                        )}
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    )
}

export default note;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, 
        paddingHorizontal: wp(4),
    },
    heading: {
        color: theme.colors.textLight,
        fontSize: hp(4),
        fontWeight: 'bold',
        marginVertical: hp(3),
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


