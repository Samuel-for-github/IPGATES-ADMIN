import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/SceenWrapper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import AntDesign from '@expo/vector-icons/AntDesign';
import { wp, hp } from '../helper/common'
import Input from '../components/Input'
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import RNPickerSelect from 'react-native-picker-select';

const SignUp = () => {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState('teacher'); // Default role is 'teacher'
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields");
            return;
        }
        if (passwordRef.current.length < 6) {
            Alert.alert('Sign Up', "Password should be at least 6 characters");
            return;
        }
        let username = usernameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        setLoading(true)

        const { data: { session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    a_name: username,
                    email,
                    role: selectedRole, // Pass the selected role here
                }
            }
        })
        console.log("session", session);
        console.log(error);

        if (error) Alert.alert('Sign Up', error.message)

        setLoading(false)
    }

    return (
        <ScreenWrapper bg='white'>
            <StatusBar style='dark' />
            <View style={styles.container}>
                <BackButton style={styles.backButton} size={28} />
                <View>
                    <Text style={styles.welcomeText}>Let's Get Started</Text>
                </View>
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(2), color: theme.colors.text }}>Please fill the details to create a new account</Text>
                    <Input icon={<AntDesign name="user" size={24} color="black" />} placeholder="Enter your name" onChangeText={(value) => { usernameRef.current = value }} />
                    <Input icon={<MaterialIcons name="mail-outline" size={24} color="black" />} placeholder="Enter your email" onChangeText={(value) => { emailRef.current = value }} />
                    <Input icon={<Ionicons name="lock-closed-outline" size={24} color="black" />} secureTextEntry placeholder="Enter your password" onChangeText={(value) => { passwordRef.current = value }} />

                    {/* Dropdown for role selection */}
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Select Role</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedRole(value)}
                            items={[
                                { label: 'Teacher', value: 'teacher' },
                                { label: 'Admin', value: 'admin' }
                            ]}
                            style={{
                                inputIOS: {
                                    color: theme.colors.text,
                                    fontSize: hp(2),
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    borderRadius: 5,
                                },
                                inputAndroid: {
                                    color: theme.colors.text,
                                    fontSize: hp(2),
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    borderRadius: 5,
                                },
                            }}
                            value={selectedRole}
                        />
                    </View>

                    <Button title='Sign Up' loading={loading} onPress={onSubmit} />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Pressable onPress={() => router.push('login')}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2)
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0, 0.07)'
    },
    pickerContainer: {
        width: '100%',
        marginVertical: hp(1),
    },
    label: {
        fontSize: hp(2),
        color: theme.colors.text,
        marginBottom: 5,
    }
})
