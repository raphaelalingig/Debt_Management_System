import { StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import API_URL from "../services/apiurl";
import React, { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import { View, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ResetPasswordScreen = ({ route, navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);


  const resetPassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New Password and Confirm Password must match");
        return;
      }
  
      const authToken = await AsyncStorage.getItem('authToken');
      console.log('authToken:', authToken);
  
      const response = await axios.post(
        API_URL + 'reset-password',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      console.log('Reset Password Response:', response.data); // Log the entire response for debugging
  
      if (response.data && response.data.message) {
        console.log(response.data.message); // Password reset successfully

        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.pop();
      } else {
        console.error('API response is missing data.message property:', response);

        ToastAndroid.show("Error in resetPassword", ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.response && error.response.status === 422 && error.response.data && error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors);
        Alert.alert("Validation Error", Object.values(error.response.data.errors).join('\n'));

        ToastAndroid.show("Validation Error", ToastAndroid.SHORT);
      } else {
        console.error('Error in resetPassword:', error.response ? error.response.data.error : error.message);

        ToastAndroid.show("Error in resetPassword", ToastAndroid.SHORT);
      }
      throw error;
    }
  };
  
  
  
  
  const handleReset = async () => {
    try {

      const newOldPassword = oldPassword;
      const newNewPassword = newPassword;
      const newConfirmPassword = confirmPassword;
      await resetPassword(newOldPassword, newNewPassword, newConfirmPassword);
    } catch (error) {
      console.error('Error in handleReset:', error);
    }
  };

  
 

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <TextInput
            placeholder="Old Password"
            label="Old Password: "
            mode="outlined"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showPass}
            right={
              <TextInput.Icon
                icon={showPass ? "eye" : "eye-off"}
                onPress={() => setShowPass(!showPass)}
              />
            }
          ></TextInput>
          <TextInput
            placeholder="New Password"
            mode="outlined"
            value={newPassword}
            onChangeText={setNewPassword}
            label="New Password: "
            secureTextEntry={!showNewPass}
            right={
              <TextInput.Icon
                icon={showNewPass ? "eye" : "eye-off"}
                onPress={() => setShowNewPass(!showNewPass)}
              />
            }
          ></TextInput>
          <TextInput
            placeholder="Confirm Password"
            label="Confirm Password: "
            mode="outlined"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
            right={
              <TextInput.Icon
                icon={showConfirmPass ? "eye" : "eye-off"}
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              />
            }
          ></TextInput>
          <View style={{ marginTop: 20, gap: 5 }}>
            <TouchableOpacity>
              <Button
                style={styles.button}
                title="Reset Password"
                onPress={handleReset}
              >
                <Text variant="bodyMedium">Reset Password</Text>
              </Button>
              <Button
                style={{ backgroundColor: "#FFD803", marginTop: 10 }}
                title="Reset Password"
                onPress={() => navigation.pop()}
              >
                <Text variant="bodyMedium">Cancel</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#BAE8E8",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 10,
  },
  displayPicture: {},
  details: {
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    left: 135,
  },
  button: {
    backgroundColor: "#FFD803",
  },
});
