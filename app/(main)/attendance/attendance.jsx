import { Alert, ScrollView, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import ScreenWrapper from '../../../components/SceenWrapper';
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import { theme } from '../../../constants/theme.js';
import BackButton from '../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';

const attendance = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { folder } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState('');
    const [cId, setCId] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [event]); // Fetch students on mount

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('course').select().eq("c_name", folder).eq("request", "Accepted");
            if (error) throw error;
          
            
            

            let tempAttendanceData = [];

            for (const val of data) {
                if (val.c_name===folder) {
                    setCId(val.c_name)
                }
                
                const { data: studentData, error: studentError } = await supabase.from('student').select().eq("id", val.student_id);
                if (studentError) throw studentError;

                studentData.map((student) => {
                    tempAttendanceData.push({
                        name: student.s_name,
                        present: false, // Default value for attendance
                        id: student.id, // Store student ID if you need to use it later
                    });
                });
            }

            // Set the updated attendance data
            setAttendanceData(tempAttendanceData);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    const toggleAttendance = (index) => {
        console.log(index);
        
        // Clone the attendance data array to ensure immutability
        const updatedData = [...attendanceData];
        
        // Toggle the present status of the selected student
        updatedData[index].present = !updatedData[index].present;
        
        // Update the attendanceData state with the new attendance status
        setAttendanceData(updatedData);
    };
    
    const updateAttendance = async () => {
        setLoading(true);
        try {
            for (const student of attendanceData) {
                await supabase.from('attendance').upsert({
                    student_id: student.id,
                    course_name: cId,
                    date: selectedDate,
                    status: student.present ? 'present' : 'absent'
                });
            }
            Alert.alert('Success', 'Attendance updated successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (day) => {
        setEvent(day)
        setSelectedDate(day.dateString);
        // Reset attendance data when a new date is selected
        let tempAttendanceData = [];
    
        try {
            // Fetch attendance data for the selected date
            const { data, error } = await supabase
                .from('attendance')
                .select('student_id, status')
                .eq('date', day.dateString)
                .in('student_id', attendanceData.map(student => student.id));
    
            if (error) throw error;
    
            // Update the attendance data based on the fetched data
            attendanceData.forEach(student => {
                const studentAttendance = data.find(att => att.student_id === student.id);
                if (studentAttendance) {
                    student.present = studentAttendance.status === 'present';
                }
                tempAttendanceData.push(student);
            });
    
            setAttendanceData([...tempAttendanceData]);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    
    

    return (
        <ScreenWrapper bg="#000">
            <StatusBar style='light' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton color="white" size={35} />
                    <View style={styles.icon}>
                        <Pressable>
                            <Feather name="log-out" color="white" size={24} />
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.heading}>Mark {folder} Attendance</Text>
                <Calendar
                    onDayPress={handleDateChange}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: 'blue' }
                    }}
                    theme={{
                        calendarBackground: theme.colors.background,
                        dayTextColor: 'white',
                        monthTextColor: 'white',
                        arrowColor: 'white'
                    }}
                />
                {selectedDate && <Text style={styles.selectedDate}>Selected Date: {selectedDate}</Text>}
                <ScrollView>
                    {attendanceData.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cell}>{item.name}</Text>
                            <TouchableOpacity
                                style={[styles.attendanceButton, item.present ? styles.present : styles.absent]}
                                onPress={() => toggleAttendance(index)}
                            >
                                <Text style={styles.buttonText}>{item.present ? 'Present' : 'Absent'}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={updateAttendance} disabled={loading}>
                    <Text style={styles.submitButtonText}>{loading ? 'Updating...' : 'Update Attendance'}</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default attendance;

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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
    },
    cell: {
        color: 'white',
        fontSize: hp(2.5),
    },
    attendanceButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    present: {
        backgroundColor: 'green',
    },
    absent: {
        backgroundColor: 'red',
    },
    selectedDate: {
        color: 'white',
        fontSize: hp(2.5),
        marginVertical: hp(2),
        textAlign: 'center',
    },
    buttonText: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: 'white',
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    }
});
