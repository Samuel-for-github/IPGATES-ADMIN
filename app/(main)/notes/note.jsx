import { Alert, ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { decode } from 'base64-arraybuffer';
import ScreenWrapper from "../../../components/SceenWrapper";
import { supabase } from '../../../lib/supabase.js';
import { useAuth } from '../../../context/AuthContext.js';
import { hp, wp } from '../../../helper/common.js';
import { theme } from '../../../constants/theme.js';
import BackButton from '../../../components/BackButton.jsx';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../../components/Button.jsx';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Loading from '../../../components/Loading.jsx';
import Input from '../../../components/Input.jsx';

const note = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const { folder } = useLocalSearchParams();
  const [uri, setUri] = useState(null);
  const [fileName, setFileName] = useState(''); // New state for file name
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to hold uploaded files

  const select = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    let file = result.assets[0].uri;
    setUri(file);
  };

  const upload = async () => {
    if (!fileName.trim()) {
      Alert.alert('Error', 'Please provide a file name');
      return;
    }

    setLoading(true);

    const fileBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    let fileData = decode(fileBase64);

    const { data, error } = await supabase
      .storage
      .from('notes')
      .upload(`public/${folder}/${fileName}`, fileData, {
        contentType: 'application/pdf',
      });
    if (error) {
      console.log("file upload error", error);
      setLoading(false);
      return { success: false };
    }
    console.log(data);
    if (data) {
      setFileName("");
      setLoading(false);
      Alert.alert('Success', 'File uploaded successfully');
      fetchUploadedFiles(); // Refresh the list of files
    }
  };

  // Fetch uploaded files from Supabase
  const fetchUploadedFiles = async () => {
    const { data, error } = await supabase
      .storage
      .from('notes')
      .list(`public/${folder}`, { limit: 100 });
  
    if (error) {
      console.log("Error fetching files", error);
    } else {
      // Define the list of file names you want to exclude (for example)
      const excludedFiles = ['.emptyFolderPlaceholder',];
  
      // Filter out files with names in the excludedFiles array
      const filteredFiles = data.filter(file => !excludedFiles.includes(file.name));
  
      // Set the filtered files to the state
      setUploadedFiles(filteredFiles);
    }
  };
  

  // Delete a file
  const deleteFile = async (fileName) => {
    Alert.alert('Confirm', `Are you sure you want to delete ${fileName}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          const { error } = await supabase
            .storage
            .from('notes')
            .remove([`public/${folder}/${fileName}`]);

          if (error) {
            console.log("Error deleting file", error);
          } else {
            Alert.alert('Success', `${fileName} deleted successfully`);
            fetchUploadedFiles(); // Refresh the list of files
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Fetch files when component mounts or when the folder changes
  useEffect(() => {
    fetchUploadedFiles();
  }, [folder]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log("logout cancel"),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => signOut(),
        style: 'destructive',
      },
    ]);
  };

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

        <Text style={styles.heading}>Upload {folder} Notes</Text>

        <ScrollView>
          <View style={styles.content}>
            <Button
              buttonStyle={styles.button}
              title="Select Document"
              onPress={select}
            />

            {uri && (
              <Input
                value={fileName}
                onChangeText={setFileName}
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

            <Text style={styles.heading}>Uploaded Documents</Text>
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((file) => (
                <View key={file.name} style={styles.fileItem}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Pressable onPress={() => deleteFile(file.name)}>
                    <Feather name="trash-2" color="red" size={24} />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.noFilesText}>No files uploaded yet.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

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
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(80),
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: hp(1),
  },
  fileName: {
    color: theme.colors.textLight,
    fontSize: hp(2.5),
  },
  noFilesText: {
    color: theme.colors.textLight,
    fontSize: hp(2),
    textAlign: 'center',
    marginTop: hp(2),
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
});
