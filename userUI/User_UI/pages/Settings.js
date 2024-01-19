import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Appbar, Avatar, Button, Card, Text, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Content
          title={<Title style={styles.titleMedium}>Settings</Title>}
        />
        <Appbar.Action
          icon="account-cog-outline"
          size={45}
          onPress={() => {}}
        />
      </Appbar.Header>
      <View style={styles.featureContainer}>
        <View style={styles.userLogoSettings}>
          <Avatar.Icon
            size={200}
            icon="account-check"
            color="black"
            backgroundColor={"white"}
            style={{ shadowOpacity: 80, elevation: 15 }}
          />
        </View>

        <View style={styles.featureSettings}>
          <TouchableOpacity style={styles.buttonSettings}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Name: User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSettings}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSettings}>
            <MaterialCommunityIcons 
              name="account-lock-open-outline"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton}>
            <MaterialIcons
              name="logout"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#BAE8E8",
    marginTop: 25,
    marginBottom: 25,
  },
  titleMedium: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },
  featureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  featureSettings: {},
  userLogoSettings: {
    marginBottom: 40,
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
  logoutButton: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-start",

    backgroundColor: "#fff",
    width: 250,
    paddingVertical: 10,
    borderRadius: 10,
    shadowOpacity: 80,
    elevation: 15,
    marginTop: 70,
  },
});
