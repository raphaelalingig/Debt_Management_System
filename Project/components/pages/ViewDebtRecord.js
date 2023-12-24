import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect} from "react";
import { TextInput, Text, Button } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";
import API_URL from "../services/apiurl";
import axios from "axios";
import { ToastAndroid } from "react-native";
import ConfirmationModal from './Confirmation';

const ViewDebtRecord = ({ navigation, route }) => {
  const { uthangInfo } = route.params;
  const { debtorInfo } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [item_id, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(uthangInfo?.quantity || "");
  const [query, setQuery] = useState(uthangInfo?.item_name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const items = [
    { id: 1, name: 'Rice' },
    { id: 2, name: 'Egg' },
    { id: 3, name: 'Bread' },,
    { id: 4, name: 'Powdered Milk' },
    { id: 5, name: 'Softdrink' },
    { id: 6, name: 'Juice' },
    { id: 7, name: 'Coffee' },
    { id: 8, name: 'Sugar' },
    { id: 9, name: 'Bleach' },
    { id: 10, name: 'Soap' },
    { id: 11, name: 'Beer' },
  ];

  const handleInputChange = (text) => {
    setQuery(text);
    if (text === '' && isInputClicked) {
      // Clear suggestions and reset the input click state
      setSuggestions([]);
      setIsInputClicked(false);
    } else {
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredItems);
    }
  };

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  const handleItemPress = (item) => {
    setQuery(item.name);
    setItemId(item.id);
    setSuggestions([]);
    setEditedData({ ...editedData, item: item.name, quantity: quantity });
  };

  // Assuming you want to allow editing and have local state for it
  const [editedData, setEditedData] = useState({
    item: uthangInfo.item_name,
    quantity: uthangInfo.quantity.toString(),
  });

  useEffect(() => {
    setEditedData({ ...editedData, quantity: quantity });
  }, [quantity]);


  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!uthangInfo?.u_id) {
          console.error("Missing 'u_id' in uthangInfo");
          return;
      }

      const url = API_URL + 'updateutang/' + uthangInfo.u_id;
      const data = {
          quantity: quantity,
          item_id: item_id,
      };

      console.log("Request URL:", url);
      const result = await axios.put(url, data);

          if (result?.data?.uthang) {
              // Access the updated Uthang data
              console.log(result.data.uthang);
              navigation.navigate("ClickforMoreDetails", { debtorInfo });
          } else {
              // Handle error if needed
              console.log(result?.data?.error || result?.message);
          }

  } catch (e) {
      showToast(e.toString());
      console.error(e);
  } finally {
      setLoading(false);
      console.log("Edited Data:", editedData);
  }
  };

  const handleConfirm = async () => {
    setIsModalVisible(false);
    try {
      setLoading(true);
      const url = API_URL + 'payutang/' + uthangInfo.u_id;
      const response = await axios.delete(url);
  
      console.log("Response data:", response.data);
      if (response.data && response.data.message === "Uthang deleted successfully") {
        // Handle success
        console.log("Uthang deleted successfully");
        ToastAndroid.show("Uthang deleted successfully", ToastAndroid.SHORT);
        // Navigate or perform other actions
        navigation.navigate("ClickforMoreDetails",{debtorInfo});
      } else {
        // Handle the case where the API response does not indicate success
        console.error(
          "Uthang deletion failed:",
          response.data.message || "Unknown error"
        );
        ToastAndroid.show("Uthang deletion failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error("Error deleting uthang:", error.message);
      ToastAndroid.show("Error deleting uthang", ToastAndroid.SHORT);
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
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.autoCompleteContainer}>
          <TextInput
              placeholder={uthangInfo.item_name}
              label="Item"
              mode="outlined"
              value={query}
              onChangeText={handleInputChange}
              onFocus={handleInputClick}
            />
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <View style={styles.suggestionItem}>
                      <Text>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()} // assuming id is a number
              />
              </View>
              <TextInput
                style={styles.quantityInput}
                placeholder={uthangInfo.quantity.toString()}
                label="Quantity"
                mode="outlined"
                value={quantity.toString()}
                onChangeText={setQuantity}
                error={isError}
              />
          </View>
          <View style={{ marginTop: 20, gap: 5 }}>
            <TouchableOpacity onPress={handleSave}>
              <Button 
              disabled={loading}
              loading={loading}
              style={styles.button}
              >Save</Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Button style={{ backgroundColor: "#13C913" }}>
                <Text style={{ color: "white" }}>Pay</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ClickforMoreDetails",{debtorInfo})}>
              <Button style={{ backgroundColor: "red" }}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </Button>
            </TouchableOpacity>
          </View>
          <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
        </View>
     
    
  );
};

export default ViewDebtRecord;

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
  autoCompleteContainer: {
    position: "relative",
    zIndex: 1,
    marginBottom: 10,
    width: "100%",
  },

  quantityInput: {
    height: 50,
    marginBottom: 10,
  },
  suggestionItem: {
    height: 40, // Adjust the height according to your preference
    paddingVertical: 10, // Adjust the vertical padding according to your preference
    paddingHorizontal: 15, // Adjust the horizontal padding according to your preference
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
});
