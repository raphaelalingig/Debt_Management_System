import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Button, Text } from "react-native-paper";

const logo = require("../pages/pictures/Logo.png");
const Intro = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logocont}>
        <Image source={logo} style={styles.image} />
      </View>
      <View style={styles.titlebox}>
        <Text variant="headlineSmall" style={styles.titleText}>
          UTHANGS
        </Text>
        <Text variant="titleSmall" style={styles.titleText}>
          A Sari-Sari Store Debt Management App
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate("LoginForms")}
        >
          <Button
            style={styles.button}
            variant="bodyLarge"
            labelStyle={styles.buttonText}
          >
            Login
          </Button>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate("SignupForm")}
        >
          <Button
            style={styles.regbutton}
            variant="bodyLarge"
            labelStyle={styles.buttonText}
          >
            Register
          </Button>
        </TouchableOpacity>
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
  titlebox: {
    backgroundColor: "#E3F6F5",
    borderRadius: 15,
    marginBottom: 150,
  },
  titleText: {
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  subtitleText: {
    fontWeight: "bold",
    padding: 25,
    backgroundColor: "#E3F6F5",
    borderRadius: 15,
    marginBottom: 150,
  },
  buttons: {
    gap: 5,
  },
  buttonWrapper: {
    width: "100%", // Make the wrapper take the full width
  },
  button: {
    backgroundColor: "#FFD803",
    padding: 5,
    paddingHorizontal: 50,
  },
  regbutton: {
    backgroundColor: "#FFD803",
    padding: 5,
    paddingHorizontal: 42,
  },
  buttonText: {
    color: "black",
  },
  signupContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  logocont: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 250,
    height: 250,
    borderRadius: 150
    
  },
});
