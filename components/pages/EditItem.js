import { StyleSheet, View, TouchableOpacity, ToastAndroid, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import ConfirmationModal from "./Confirmation";
import API_URL from "../services/apiurl";
import axios from "axios";

const EditItem = ({ route, navigation }) => {
  const { selectedItem } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState(selectedItem.item_name || "");
  const [itemPrice, setItemPrice] = useState(selectedItem.price || 0);
  const [itemCategory, setItemCategory] = useState(selectedItem.category || "");

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
  
      if (!selectedItem?.item_id) {
        console.error("Missing 'item_id' in Items");
        return;
      }
  
      const url = API_URL + "edit_item/" + selectedItem.item_id;
      const data = {
        item_name: itemName,
        price: itemPrice,
        category: itemCategory,
      };
  
      console.log("Request URL:", url);
      const result = await axios.put(url, data);
  
      if (result?.data?.message === "Item updated successfully") {
        showToast(result?.data?.message);
        console.log(result?.data?.message);
        navigation.navigate("Items");
        console.log("Navigating to Items");
      } else {
        // Handle error if needed
        console.log(result?.data?.error || result?.data?.message);
        showToast("Failed to update item");
      }
  
    } catch (e) {
      showToast("Something went wrong");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  

  const handleConfirm = async () => {
    setIsModalVisible(false);
    try {
      setLoading(true);
      const url = API_URL + "delete_item/" + selectedItem.item_id;
      const response = await axios.delete(url);
  
      if (response.status === 200) {
        // Log success
        console.log("Item deleted successfully");
        ToastAndroid.show("Item deleted successfully", ToastAndroid.SHORT);
        // Navigate to a success page or perform any other action
        navigation.navigate("MainPage");
      } else {
        // Handle the case where the API response does not indicate success
        console.error("Item deletion failed:", response.data.message || "Unknown error");
        ToastAndroid.show("Item deletion failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Handle network error or other exceptions
      if (error.response && error.response.status === 422 && error.response.data.message === "Cannot delete Debtor, Uthangs still unpaid.") {
        // Handle the specific error scenario where Uthangs are still unpaid
        console.error("Cannot delete Item, Uthangs still unpaid.");
        ToastAndroid.show("Cannot delete Item, Uthangs still unpaid.", ToastAndroid.SHORT);
      } else {
        // Handle other errors
        console.error("Error deleting Item:", error.message);
        ToastAndroid.show("Error deleting Item", ToastAndroid.SHORT);
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
        
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Item: "
            label="Item: "
            mode="outlined"
            value={itemName}
            onChangeText={setItemName}
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Price: "
            label="Price: "
            mode="outlined"
            value={itemPrice}
            onChangeText={setItemPrice}
          ></TextInput>
          <TextInput
            style={{ height: 30 }}
            placeholder="Category: "
            label="Category: "
            mode="outlined"
            value={itemCategory}
            onChangeText={setItemCategory}
          ></TextInput>
          <View style={{ marginTop: 20, gap: 5 }}>
            <View
              style={{ gap: 5, flexDirection: "row", justifyContent: "center", marginBottom: 4 }}
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
                    Delete Item
                  </Text>
                </Button>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.pop()
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

export default EditItem;

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
