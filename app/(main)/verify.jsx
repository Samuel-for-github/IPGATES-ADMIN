import { Alert, FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/SceenWrapper.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import BackButton from '../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Button.jsx';
import Loading from '../../components/Loading.jsx';
import { getCourseData } from '../../services/courseSevice.js';
import { theme } from '../../constants/theme.js';
import { getStudentData } from '../../services/studentService.js';

const Verify = () => {
    const { user } = useAuth();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [name, setName] = useState('');

    const fetchCourseData = async () => {
        setRefreshing(true); // Indicate pull-to-refresh
        try {
            const res = await getCourseData();
            // console.log(res.data);
            
            const courseData = await Promise.all(res.data.map(async (val, i) => {
                const studentData = await getStudentData(val.student_id);
                return {
                    ...val,
                    studentName: studentData ? studentData[0]?.s_name : 'Unknown', // Assuming student data is an array
                };
            }));
            
            setPending(courseData || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, []);

    const handleAccept = async (index, cId) => {
        const updatedPending = pending.filter((_, i) => i !== index);
        setPending(updatedPending);

        const { data, error } = await supabase
            .from('course')
            .update({ request: 'Accepted' })
            .eq('c_id', cId);

        if (error) {
            console.error(error.message);
        } else {
            console.log(data);
        }
    };

    return (
        <ScreenWrapper bg="#121212">
            <StatusBar style='light' />
            <BackButton color="white" size={35} />
            <View style={styles.container}>
                <Text style={styles.header}>Verify Courses</Text>

                {loading ? (
                    <Loading />
                ) : (
                    <FlatList
                        data={pending}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={fetchCourseData} />
                        }
                        renderItem={({ item, index }) => (
                            <View style={styles.card}>
                                <Text style={styles.courseName}>Course Name: {item.c_name}</Text>
                                <Text style={styles.courseName}>Student Name: {item.studentName}</Text>
                                <Text style={styles.courseName}>Price: {item.fees}</Text>
                                <Button buttonStyle={styles.button} title='Accept' onPress={() => handleAccept(index, item.c_id)} />
                            </View>
                        )}
                        ListEmptyComponent={() => (
                            <Text style={styles.noCourses}>No pending courses.</Text>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

export default Verify;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(5),
    },
    header: {
        fontSize: hp(4),
        fontWeight: 'bold',
        color: 'white',
        marginVertical: hp(2),
    },
    noCourses: {
        fontSize: hp(2.5),
        color: 'gray',
        textAlign: 'center',
        marginTop: hp(5),
    },
    listContainer: {
        width: '100%',
        paddingBottom: hp(10),
        flexGrow: 1, // Ensures ListEmptyComponent is centered
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: hp(2),
        borderColor: theme.colors.darkLight,
        borderWidth: 1,
        gap: hp(2),
        borderRadius: 10,
        marginVertical: hp(1),
    },
    courseName: {
        fontSize: hp(2.2),
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        borderRadius: 5,
    }
});
