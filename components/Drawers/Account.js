import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, Card, Title, Paragraph } from "react-native-paper";
import API_URL from "../services/apiurl";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Zocial } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

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
        const response = await axios.get(API_URL + "userdata", { headers });
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
      return { role: "Regular User" }; 
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="account-tie"
        size={100}
        color="black"
        style={styles.userLogo}
      />
      {userData ? (
        <View style={styles.featureContainer}>
          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.iconsNText}>
              <FontAwesome5
                name="orcid"
                size={24}
                color="black"
                style={{ marginRight: 10, marginLeft: 15 }}
              />
              <Text variant="titleMedium">User ID: {userData.id}</Text>
            </View>
            <View style={styles.iconsNText}>
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={24}
                color="black"
                style={{ marginRight: 5, marginLeft: 15 }}
              />
              <Text variant="titleMedium"> Name: {userData.name}</Text>
            </View>
            <View style={styles.iconsNText}>
              <Zocial
                name="email"
                size={24}
                color="black"
                style={{ marginRight: 9, marginLeft: 15 }}
              />
              <Text variant="titleMedium">Email: {userData.email}</Text>
            </View>
            <View style={styles.iconsNText}>
              <MaterialIcons
                name="security"
                size={24}
                color="black"
                style={{ marginRight: 3, marginLeft: 15 }}
              />
              <Text variant="titleMedium">
                {" "}
                Privilege: {roles(userData.role)?.role}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Error fetching user data</Text>
      )}

      <View style={{marginTop: 20}}>
        <TouchableOpacity
          style={styles.buttonSettings}
          onPress={() => navigation.navigate("ResetPassword", { userData })}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="account-lock-open-outline"
            size={24}
            color="black"
            style={{ marginRight: 15, marginLeft: 15 }}
          />
          <Text variant="titleMedium" style={{ color: "black" }}>
            Reset Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSettings} onPress={handleLogout}>
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            style={{ marginRight: 15, marginLeft: 15 }}
          />
          <Text variant="titleMedium" style={{ color: "black" }}>
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
    backgroundColor: "white",
  },

  userLogo: {
    padding: 50,
    backgroundColor: "#f8f8ff",
    borderRadius: 150,
    elevation: 5,
    marginTop: 40,
    marginBottom: 20,
  },

  featureContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  userInfo: {
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    width: "auto",
    paddingVertical: 10,
    borderRadius: 10,
    shadowOpacity: 80,
    elevation: 15,
    marginTop: 10,
    gap: 10,
  },
  buttonSettings: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    width: 250,
    paddingVertical: 10,
    borderRadius: 10,
    shadowOpacity: 80,
    elevation: 15,
    marginTop: 10,
  },
  iconsNText: {
    flexDirection: "row",
    textAlign: "center",
    marginRight: 10,
  },
});

export default AccountPage;
