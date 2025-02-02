import { Alert, ScrollView, Pressable, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import ScreenWrapper from "../../components/SceenWrapper";
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js'
import { theme } from '../../constants/theme.js'
import BackButton from '../../components/BackButton.jsx'
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Button from '../../components/Button.jsx';
import { courses } from '../../constants/data.js';

const Job = () => {
    const { setAuth, user } = useAuth()
    const router = useRouter()
    const [completedStudents, setCompletedStudents] = useState([]);

    useEffect(() => {
        // Fetch completed students from Supabase when the component loads
        fetchCompletedStudents();
    }, []);

    async function fetchCompletedStudents() {
        try {
            // Fetch completed students from the 'completedStudent' table
            const { data, error } = await supabase
                .from('completedStudent') // Assuming the table is named 'completedStudent'
                .select('*');

            if (error) {
                console.error(error);
                return;
            }

            // Fetch student names based on student_id for each completed student
            const studentsWithNames = await Promise.all(data.map(async (student) => {
                const { data: studentData, error: studentError } = await supabase
                    .from('student') // Assuming the 'student' table contains student names
                    .select('s_name')
                    .eq('id', student.student_id)
                    .single(); // Fetching a single record for the specific student_id

                if (studentError) {
                    console.error(studentError);
                    return student; // Returning the original student if an error occurs
                }

                // Return the completed student data along with the student's name
                return {
                    ...student,
                    s_name: studentData?.s_name || 'Unknown' // Defaulting to 'Unknown' if no name is found
                };
            }));

            setCompletedStudents(studentsWithNames); // Store the updated completed students with names
        } catch (error) {
            console.error('Error fetching completed students:', error);
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
            }, 
            {
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
                        {/* Display students who completed the course */}
                        <Text style={styles.heading}>Completed Students</Text>
                        {completedStudents.length > 0 ? (
                            completedStudents.map((student, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.completedStudentCard}
                                    onPress={() => router.push(`/send/send?student_id=${student.student_id}`)}
                                >
                                    <Text style={styles.completedStudentText}>
                                        Student Name: <Text style={{color: theme.colors.textLight}}>{student.s_name}</Text> 
                                    </Text>
                                    <Text style={styles.completedStudentText}>

                                    Course Name: <Text style={{color: theme.colors.textLight}}>{student.course_name}</Text>
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.cardsText}>No students have completed any courses yet.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default Job;

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
    icon: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between'
    },
    content: {
        flex: 1,
        alignItems: 'center'
    },
    completedStudentCard: {
        marginVertical: hp(2),
        padding: hp(3),
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.primary,
        width: wp(80),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        opacity: 0.9,
        elevation: 3,
    },
    completedStudentText: {
        fontSize: hp(2),
        color: theme.colors.textDark,
        // textAlign: 'center',
    },
    cardsText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    }
});
