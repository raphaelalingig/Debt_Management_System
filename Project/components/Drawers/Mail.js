import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import HTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '../services/apiurl';
import { useNavigation } from '@react-navigation/native';


const Mail = () => {
  const [userData, setUserData] = useState(null);
  const [mailList, setMailList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const mailItem = {
    id: 1, // Make sure each item has a unique id property
    subject: 'Your Mail Subject',
    // ... other properties
  };
  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        };
        const response = await axios.get(API_URL + 'user-data', { headers });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Only fetch mail list if userData is available
    if (userData) {
      const fetchMailList = async () => {
        try {
          const response = await axios.post(API_URL + 'reset-token', {
            email: userData.email,
          });

          const data = response.data;
          setMailList(data);

          console.log(response.data);
        } catch (error) {
          console.error('Error fetching password reset email:', error);
          console.log('Error details:', error.response);
          setLoading(false);
        }
      };

      // Call the function to fetch the mail list when the component mounts
      fetchMailList();
    }
  }, [userData]); // Add userData as a dependency to useEffect

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToMailPage(item)}>
      <View style={styles.mailItem}>
        {/* Use HTML component to render HTML content */}
        <HTML source={{ html: item.subject }} />
      </View>
    </TouchableOpacity>
  );

  // Modify the onPress event to use the navigation object
  const navigateToMailPage = (item) => {
    // Add your navigation logic here, e.g., navigate to a new screen
    navigation.navigate('Mailpage', { mailItem: item });
  };

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading indicator
  }
  if (mailList.length === 0) {
    return <Text>No mail items to display</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mailList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mailItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white', // Set a background color for mailItem
  },
  mailText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black', // Set a text color for mailText
  },
});

export default Mail;
