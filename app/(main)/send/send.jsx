import { Alert, ScrollView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from "../../../components/SceenWrapper";
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import { theme } from '../../../constants/theme.js';
import BackButton from '../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Button from '../../../components/Button.jsx';
import Loading from '../../../components/Loading.jsx';

const Send = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for input fields
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  // Extract the student_id from the URL query parameter
  const { student_id } = useLocalSearchParams();

  useEffect(() => {
    if (student_id) {
      // If student_id is provided, you can pre-fill or handle it differently
      console.log(`Sending notifications to student with ID: ${student_id}`);
    }
  }, [student_id]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  }

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => signOut(), style: 'destructive' },
    ]);
  };

  // Function to send job notifications
  const sendJobNotifications = async () => {
    if (!jobTitle || !company || !description) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      let completedStudents = [];

      if (student_id) {
        // If student_id is provided, fetch only that student's record
        completedStudents = [{ student_id }];
      } else {
        // Fetch all students who completed a course
        const { data: students, error: fetchError } = await supabase
          .from('completedStudent')
          .select('student_id');

        if (fetchError) throw fetchError;

        completedStudents = students;
      }

      if (completedStudents.length === 0) {
        Alert.alert("No students have completed any courses.");
        setLoading(false);
        return;
      }

      // Prepare job notifications
      const jobNotifications = completedStudents.map(student => ({
        student_id: student.student_id,
        job_title: jobTitle,
        company: company,
        description: description,
      }));

      // Insert job notifications
      const { error: insertError } = await supabase
        .from('jobNotification')
        .insert(jobNotifications);

      if (insertError) throw insertError;

      Alert.alert("Success", "Job notifications sent successfully!");

      // Clear input fields
      setJobTitle("");
      setCompany("");
      setDescription("");

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

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

        <Text style={styles.heading}>Send Job Notifications</Text>

        <ScrollView>
          <View style={styles.content}>
            {/* Job Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Job Title"
              placeholderTextColor="#999"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            
            {/* Company Input */}
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              placeholderTextColor="#999"
              value={company}
              onChangeText={setCompany}
            />

            {/* Description Input */}
            <TextInput
              style={[styles.input, { height: hp(15) }]}
              placeholder="Job Description"
              placeholderTextColor="#999"
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {/* Send Notification Button */}
            <Button title="Send Notifications" onPress={sendJobNotifications} disabled={loading} />
            {loading && <Loading />}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Send;

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
    marginLeft: wp(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },
  icon: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(5),
  },
  input: {
    width: wp(80),
    backgroundColor: '#222',
    color: '#fff',
    fontSize: hp(2),
    padding: hp(2),
    borderRadius: theme.radius.md,
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
});
