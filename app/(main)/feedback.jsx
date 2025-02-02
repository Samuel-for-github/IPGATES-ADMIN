import { Alert, ScrollView, RefreshControl, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import ScreenWrapper from "../../components/SceenWrapper";
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.js';
import { hp, wp } from '../../helper/common.js';
import { theme } from '../../constants/theme.js';
import BackButton from '../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Loading from '../../components/Loading.jsx';

const Job = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    const { data: feedbackData, error: feedbackError } = await supabase.from('feedback').select('*');
    if (feedbackError) {
      Alert.alert('Error', feedbackError.message);
      setLoading(false);
      return;
    }
    
    const studentIds = feedbackData.map(f => f.student_id);
    const { data: studentsData, error: studentError } = await supabase.from('student').select('id, s_name').in('id', studentIds);
    if (studentError) {
      Alert.alert('Error', studentError.message);
      setLoading(false);
      return;
    }

    const studentMap = Object.fromEntries(studentsData.map(s => [s.id, s.s_name]));
    const updatedFeedbacks = feedbackData.map(f => ({ ...f, student_name: studentMap[f.student_id] || 'Unknown' }));

    setFeedbacks(updatedFeedbacks);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeedbacks().then(() => setRefreshing(false));
  }, []);

  return (
    <ScreenWrapper bg="#000">
      <StatusBar style='light' />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton color="white" size={35} />
          <View style={styles.icon}>
            <Pressable onPress={() => router.back()}>
              <Feather name="log-out" color="white" size={24} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.heading}>Feedbacks</Text>

        {loading ? (
          <Loading />
        ) : (
          <ScrollView 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.content}>
              {feedbacks.length === 0 ? (
                <Text style={styles.noFeedback}>No feedback available.</Text>
              ) : (
                feedbacks.map((item, index) => (
                  <View key={index} style={styles.feedbackCard}>
                    <Text style={styles.courseName}>{item.course_name}</Text>
                    <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
                    <Text style={styles.feedbackText}>{item.content}</Text>
                    <Text style={styles.user}>- {item.student_name}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Job;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: theme.colors.textLight,
    fontSize: hp(3),
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
  },
  feedbackCard: {
    backgroundColor: '#40916c',
    padding: wp(4),
    marginVertical: hp(1),
    borderRadius: theme.radius.md,
    width: wp(90),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  courseName: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: 'white',
  },
  rating: {
    fontSize: hp(2),
    color: 'white',
    marginTop: hp(0.5),
  },
  feedbackText: {
    fontSize: hp(2),
    color: 'white',
    marginTop: hp(1),
  },
  user: {
    fontSize: hp(1.8),
    color: '#ddd',
    marginTop: hp(1),
    textAlign: 'right',
  },
  noFeedback: {
    fontSize: hp(2),
    color: 'white',
    textAlign: 'center',
    marginTop: hp(5),
  },
});