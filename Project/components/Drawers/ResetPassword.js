import { StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import API_URL from "../services/apiurl";
import React, { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import { View, Alert } from "react-native";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { userData } = route.params;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);

  const handleResetPassword = async () => {
    try {
      // Validate that new password and confirm password match
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New Password and Confirm Password must match");
        return;
      }

      const response = await fetch(API_URL + "reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Include any additional headers as needed
        },
        body: JSON.stringify({
          user_id: userData.id,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Password reset successfully
        Alert.alert("Success", data.message);
        navigation.navigate("Account");
      } else {
        // Display error message
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
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
                onPress={handleResetPassword}
              >
                <Text variant="bodyMedium">Reset Password</Text>
              </Button>
              <Button
                style={{ backgroundColor: "#FFD803", marginTop: 10 }}
                title="Reset Password"
                onPress={() => navigation.navigate("MainPage")}
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