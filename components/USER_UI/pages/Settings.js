import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Avatar, Button, Card, Text, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Zocial } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../../services/apiurl";
import base64 from 'base64-js';

const Settings = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState('');
  const [resetPasswordPressed, setResetPasswordPressed] = useState(false);
  const [debtor,setDebtor] = useState([]);
  const [image, setImage] = useState(null);

  const getUsers = async () => {
    const storedD_id = await AsyncStorage.getItem('d_id');
    setUser(storedD_id);
  };

  const fetchData = useCallback(() => {
    getUsers()
    if (user) {
      axios
        .get(API_URL + 'debtor/' + user)
        .then((response) => {
          setDebtor(response.data);
          getImage();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          console.error('Response data:', error.response.data);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
    const getImage = async () => {
      try {
        const response = await axios.get(API_URL + 'getImage/' + user, {
          responseType: 'arraybuffer',
        });
    
        if (response.status !== 200) {
          console.error("Error fetching picture:", response.data.error);
          // Handle other non-404 errors if needed
        } else {
          console.log("Response data:", response.data);
          const base64Image = `data:image/png;base64,${base64.fromByteArray(new Uint8Array(response.data))}`;
          setImage(base64Image);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 error gracefully
          console.log("Image not found (404)");
          setImage(null); // Set image to null
        } else {
          console.error("Error fetching picture:", error.message);
          console.log(error.response); // Log the entire response for more details
          // Handle other non-404 errors if needed
        }
      }
    };
      



  
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalPress = (e) => {
    e.stopPropagation(); // Prevent closing modal when clicking inside the modal
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Intro');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    // Use the effect to handle navigation when 'ResetPassword' is pressed
    if (resetPasswordPressed) {
      navigation.navigate('ResetPasswordUser');
      setResetPasswordPressed(false); // Reset the flag after navigation
    }
  }, [navigation, resetPasswordPressed]);

  

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
        {image !== null ? (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, borderRadius: 100 }}
              />
            ) : (
              <Avatar.Icon
            size={200}
            icon="account-check"
            color="black"
            backgroundColor={"white"}
            style={{ shadowOpacity: 80, elevation: 15 }}
          />
            )}
          
        </View>

        <View style={styles.featureSettings}>
          <TouchableOpacity style={styles.buttonSettings}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Name: {debtor.d_name}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent} onPress={handleModalPress}>
                  <Text variant="titleLarge" style={styles.modalTitle}>
                    My Details:{" "}
                  </Text>
                  <View style={styles.modalTextnIconAligned}>
                    <EvilIcons
                      name="user"
                      size={24}
                      color="black"
                      style={styles.modalIcons}
                    />
                    <Text variant="titleMedium">Name: {debtor.d_name}</Text>
                  </View>
                  <View style={styles.modalTextnIconAligned}>
                    <MaterialIcons
                      name="place"
                      size={24}
                      color="black"
                      style={styles.modalIcons}
                    />
                    <Text variant="titleMedium">Address: {debtor.address}</Text>
                  </View>
                  <View style={styles.modalTextnIconAligned}>
                    <MaterialIcons
                      name="phone"
                      size={24}
                      color="black"
                      style={styles.modalIcons}
                    />
                    <Text variant="titleMedium">Phone Number: {debtor.phone}</Text>
                  </View>
                  <View style={styles.modalTextnIconAligned}>
                    <Zocial
                      name="email"
                      size={24}
                      color="black"
                      style={styles.modalIcons}
                    />
                    <Text variant="titleMedium">Email: {debtor.email}</Text>
                  </View>
                  <TouchableOpacity onPress={closeModal}></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <TouchableOpacity style={styles.buttonSettings} onPress={openModal}>
            <MaterialCommunityIcons
              name="account-details"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">My Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSettings}
            onPress={() => setResetPasswordPressed(true)}
          >
            <MaterialCommunityIcons
              name="account-lock-open-outline"
              size={24}
              color="black"
              style={{ marginRight: 5, marginLeft: 15 }}
            />
            <Text variant="titleMedium">Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton}
           onPress={handleLogout}>
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    gap: 10,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 10,
  },
  modalTextnIconAligned: {
    flexDirection: "row",
  },
  modalIcons: {
    marginRight: 5,
  },
});
