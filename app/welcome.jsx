import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/SceenWrapper'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helper/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter()
    return (
        <ScreenWrapper bg="white">
            <StatusBar style='dark' />
            <View style={styles.container}>
                {/* welcome */}
                <Image style={styles.Image} source={require('../assets/images/logo.png')}/>
                <View style={{ gap: 20, alignItems: 'center' }}>
                    {/* <Text style={styles.title}>IPGATES</Text> */}
                    {/* <Image style={styles.Image} source={require('../assets/images/logo.png')}/> */}
                    <Text style={styles.punchline}>Register yourself as admin</Text>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Button title='Register' buttonStyle={{marginHorizontal: wp(3)}}
                    onPress={()=>{
                        router.push('signUp')
                    }}
                    />
                </View>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <Pressable onPress={()=>router.push('login')}><Text style={[styles.loginText, {color: theme.colors.primary, fontWeight: theme.fonts.semibold}]}>Login</Text></Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    Image: {
        height: hp(10),
        width: wp(70)
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        height: hp(40),
        width: wp(100),
        alignSelf: 'center'
    },
    title: {
        color: theme.colors.text,
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        fontSize: hp(4)
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text
    },
    footer:{
        gap: 30,
        width: '100%'
    },
    bottomTextContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText:{
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2)
    }
    
})