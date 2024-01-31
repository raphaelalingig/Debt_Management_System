import { StyleSheet, View, TouchableOpacity, ToastAndroid, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import ConfirmationModal from "./Confirmation";
import API_URL from "../services/apiurl";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import base64 from 'base64-js';

const EditProfile = ({ route, navigation }) => {
  const { debtorInfo } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [d_name, setDebtorName] = useState(debtorInfo?.d_name || "");
  const [phone, setPhone] = useState(debtorInfo?.phone || "");
  const [address, setAddress] = useState(debtorInfo?.address || "");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState(null);

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await axios.get(API_URL + 'getImage/' + debtorInfo.d_id, {
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
    getImage();
  }, [debtorInfo]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (result.canceled) {
        console.log("Image picker was cancelled");
        return;
      }
  
      let selectedImage;
  
      if (result.assets && result.assets.length > 0) {
        // Use the first asset from the assets array
        selectedImage = result.assets[0].uri;
} else if (result.uri) {
          // Use the selected image URI if available
          selectedImage = result.uri;
      }
  

      setImage(selectedImage);
    } catch (error) {
      showToast("Error picking image");
      console.error("Error picking image:", error);
    }
  };
  

  const handleSavePic = async () => {
    try {
      setLoading(true);
    
      const imageFormData = new FormData();
      imageFormData.append("image", {
        uri: image,
        type: 'image/jpeg',
        name: 'user_profile.jpg',
      });
  
      // Assuming you have debtorInfo object with d_id
      imageFormData.append("d_id", debtorInfo.d_id);
  
      const imageUploadResponse = await axios.post(API_URL + "uploadImage", imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (imageUploadResponse?.data) {
        // Adjust this part based on the actual response structure
        const imageUrl = imageUploadResponse.data; // Change this line accordingly
  
        // Further logic to handle the image URL, e.g., save it to another table
        // ...
    
        console.log("Image uploaded successfully:", imageUrl);
      } else {
        console.error("Image upload failed:", imageUploadResponse?.data?.error || "Unknown error");
        showToast("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Error uploading image");
    } finally {
      setLoading(false);
    }
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

      if (image) {
        await handleSavePic()
      }
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
  
      if (response.status === 200) {
        // Log success
        console.log("Debtor deleted successfully");
        ToastAndroid.show("Debtor deleted successfully", ToastAndroid.SHORT);
        // Navigate to a success page or perform any other action
        navigation.navigate("MainPage");
      } else {
        // Handle the case where the API response does not indicate success
        console.error("Debtor deletion failed:", response.data.message || "Unknown error");
        ToastAndroid.show("Debtor deletion failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Handle network error or other exceptions
      if (error.response && error.response.status === 422 && error.response.data.message === "Cannot delete Debtor, Uthangs still unpaid.") {
        // Handle the specific error scenario where Uthangs are still unpaid
        console.error("Cannot delete Debtor, Uthangs still unpaid.");
        ToastAndroid.show("Cannot delete Debtor, Uthangs still unpaid.", ToastAndroid.SHORT);
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
          <TouchableOpacity onPress={handlePickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 250, height: 250, borderRadius: 125 }} />
            ) : (
              <MaterialCommunityIcons name="account-edit" size={250} color="black" />
            )}
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
                    Delete Debtor
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
