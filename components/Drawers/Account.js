import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Card, Title, Paragraph } from "react-native-paper";
import API_URL from "../services/apiurl";

const AccountPage = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        };
        const response = await axios.get(API_URL + 'userdata', { headers });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("Intro");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // const handleResetPassword = async () => {
  //   try {
  //     const authToken = await AsyncStorage.getItem('authToken');
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     const response = await axios.post(API_URL + "send-reset-email", payload, {
  //       headers,
  //     });

  //     const payload = {
  //       email: userData.email,
  //     };

      
  //   const response = await axios.post(API_URL + 'send-reset-email', payload, { headers });


  //     console.log('Password reset email sent successfully:', response.data);
  //     alert('Password reset email sent successfully. Check your email.');
  //   } catch (error) {
  //     console.error('Error sending password reset email:', error.response);
  //     // Handle the error, e.g., show an error message
  //     alert('Failed to send password reset email. Please try again.');
  //   }
  // };


 


  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

const roles = (userRole) => {
    if (userRole === 1) {
      return { role: "Admin" };
    } else {
      return { role: "Regular User" }; // or any default role you want
    }
  };


  return (
    <View style={styles.container}>
      <Feather name="user" size={100} color="black" style={styles.userLogo} />
      {userData ? (
        <View style={styles.content}>
          <View>
            <Title style={styles.header} >User Information</Title>
            <Paragraph style={styles.textcontent} >User ID: {userData.id}</Paragraph>
            <Paragraph style={styles.textcontent} >Name: {userData.name}</Paragraph>
            <Paragraph style={styles.textcontent} >Email: {userData.email}</Paragraph>
            <Paragraph style={styles.textcontent} >Privilege: {roles(userData.role)?.role}</Paragraph>
          </View>
        </View>
      ) : (
        <Text>Error fetching user data</Text>
      )}
      <View style={styles.contbutton}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ResetPassword", { userData })}
          disabled={loading}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "white",
  },

  userLogo: {
    flex: -1,
    marginBottom: 25,
    padding: 50,
    backgroundColor: "#f8f8ff",
    borderRadius: 150,
    elevation: 5,
  },

  content: {
    flex: 2,
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 50,
    backgroundColor: "white",
  },

  contbutton: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 20,
    margin: 20,
    borderRadius: 50,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },

  textcontent: {
    flex: 1,
    fontSize: 15,
    textAlign: "justify",
    marginLeft: 50,
  },

  header: {
    flex: 1,
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default AccountPage;
