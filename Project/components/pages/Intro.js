import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button, Text } from "react-native-paper";

const Intro = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.titleText}>
        Mark Jundy Sari-Sari Store Debt Management System
      </Text>
      <View style={styles.buttons}>
        <Button style={styles.button}>
          <Text style={styles.buttonText} variant="bodyLarge">
            Admin
          </Text>
        </Button>
        <Button style={styles.button}>
          <Text style={styles.buttonText} variant="bodyLarge">
            Staff
          </Text>
        </Button>
      </View>
      <View style={styles.signupContainer}>
        <Text variant="bodyMedium">Don't have an account? </Text>
        <TouchableOpacity>
          <Text
            variant="bodyMedium"
            onPress={() => navigation.navigate("SignupForm")}
            style={{ color: "#008686" }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BAE8E8",
  },
  titleText: {
    fontWeight: "bold",
    padding: 25,
    backgroundColor: "#E3F6F5",
    borderRadius: 15,
    marginBottom: 150,
  },
  buttons: {
    gap: 5,
  },
  button: {
    backgroundColor: "#FFD803",
    padding: 15,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: "black",
  },

  signupContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
});
