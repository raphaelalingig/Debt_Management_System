import { StyleSheet, View, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import ConfirmationModal from "./Confirmation";
import API_URL from "../services/apiurl";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EditProfile = ({ route, navigation }) => {
  const { debtorInfo, calculatedDueStatus } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [d_name, setDebtorName] = useState(debtorInfo?.d_name || "");
  const [phone, setPhone] = useState(debtorInfo?.phone || "");
  const [address, setAddress] = useState(debtorInfo?.address || "");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      if (!debtorInfo?.d_id) {
        console.error("Missing 'd_id' in debtorInfo");
        return;
      }

      const url = API_URL + "updatedebtor/" + debtorInfo.d_id;
      const data = {
        d_name: d_name,
        phone: phone,
        address: address,
      };

      console.log("Request URL:", url);
      const result = await axios.put(url, data);

      if (result?.data?.debtor) {
        // Access the updated Uthang data
        console.log(result.data.debtor);
        navigation.navigate("MainPage");
      } else {
        // Handle error if needed
        console.log(result?.data?.error || result?.message);
      }
    } catch (e) {
      showToast(e.toString());
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsModalVisible(false);
    try {
      setLoading(true);
      const url = API_URL + "deletedebtor/" + debtorInfo.d_id;
      const response = await axios.delete(url);

      if (
        response.data &&
        response.data.message === "Cannot delete Debtor, Uthangs still unpaid."
      ) {
        // Log success
        console.log(response.data.message);
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        // Navigate to a success page or perform any other action
        navigation.navigate("MainPage");
      } else {
        // Handle the case where the API response does not indicate success
        console.error(
          "Debtor deletion failed:",
          response.data.message || "Unknown error"
        );
        ToastAndroid.show("Debtor deletion failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Handle network error or other exceptions
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.message ===
          "Cannot delete Debtor, Uthangs still unpaid."
      ) {
        // Handle the specific error scenario where Uthangs are still unpaid
        console.error("Cannot delete Debtor, Uthangs still unpaid.");
        ToastAndroid.show(
          "Cannot delete Debtor, Uthangs still unpaid.",
          ToastAndroid.SHORT
        );
      } else {
        // Handle other errors
        console.error("Error deleting debtor:", error.message);
        ToastAndroid.show("Error deleting debtor", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Handle the "No" button click
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="account-edit"
              size={250}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Name: "
            label="Name: "
            mode="outlined"
            value={d_name}
            onChangeText={setDebtorName}
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Phone Number: "
            label="Phone Number: "
            mode="outlined"
            value={phone}
            onChangeText={setPhone}
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Address: "
            label="Address: "
            mode="outlined"
            value={address}
            onChangeText={setAddress}
          ></TextInput>
          <View style={{ marginTop: 20, gap: 5 }}>
            <View
              style={{ gap: 5, flexDirection: "row", justifyContent: "center" }}
            >
              <TouchableOpacity onPress={handleSave}>
                <Button
                  style={{ backgroundColor: "#04aa6d" }}
                  disabled={loading}
                  loading={loading}
                >
                  <Text variant="bodyMedium" style={{ color: "white" }}>
                    Save Changes
                  </Text>
                </Button>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Button
                  style={{ backgroundColor: "#f44336" }}
                  disabled={loading}
                  loading={loading}
                >
                  <Text variant="bodyMedium" style={{ color: "white" }}>
                    Delete Debtor
                  </Text>
                </Button>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ClickforMoreDetails", {
                  debtorInfo,
                  calculatedDueStatus,
                })
              }
            >
              <Button
                style={styles.button}
                disabled={loading}
                loading={loading}
              >
                <Text variant="bodyMedium">Cancel</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default EditProfile;

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
    marginTop: 25,
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
