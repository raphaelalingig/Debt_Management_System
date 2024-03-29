import { StyleSheet, View, TouchableOpacity, FlatList, BackHandler } from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { TextInput, Text, Button } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";
import ConfirmationModal from "./Confirmation";
import API_URL from "../services/apiurl";
import axios from "axios";
import { ToastAndroid } from "react-native";
import { useNavigation } from '@react-navigation/native';

const ViewDebtRecord = ({ route }) => {
  const { selectedUthang, debtorInfo, onGoBack } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [item_id, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const items = [
    { id: 1, name: 'Rice' },
    { id: 2, name: 'Egg' },
    { id: 3, name: 'Bread' },
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
    if (text === "" && isInputClicked) {
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
    setQuantity(selectedUthang.quantity.toString());
    setSuggestions([]);
    setEditedData({
      ...editedData,
      item: item.name,
      quantity: selectedUthang.quantity.toString(),
    });
  };

  // Assuming you want to allow editing and have local state for it
  const [editedData, setEditedData] = useState({
    item: selectedUthang.item_name,
    quantity: selectedUthang.quantity.toString(),
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

      if (query === "" || quantity === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      
      if (!selectedUthang?.u_id) {
        console.error("Missing 'u_id' in selectedUthang");
        return;
      }
      if (item_id === null) {
        console.warn(
          "item_id is null. Setting to default value or handling accordingly."
        );
        setItemId(selectedUthang.item_id); 
      }
  
    const url = API_URL + "updateutang/" + selectedUthang.u_id;
      const data = {
        quantity: quantity,
        item_id: item_id,
      };

      console.log("Request URL:", url);
      const result = await axios.put(url, data).catch((error) => {
      console.error("API request failed:", error);
        showToast("Failed to update data");
    });

          if (result?.data?.uthang) {
              console.log(result.data.uthang);
              navigation.navigate("ClickforMoreDetails", {
          debtorInfo,
        });
    } else {
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
  const handleGoBack = () => {
    navigation.pop();
  };
  
  

  
  return (
    <FlatList
      contentContainerStyle={styles.scrollView}
      data={[{ key: "dummy" }]}
      renderItem={() => (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            
            <View style={styles.details}>
              <View style={styles.autoCompleteContainer}>
              <TextInput
                placeholder={selectedUthang.item_name}
                label="Item"
                mode="outlined"
                value={query}
                onChangeText={handleInputChange}
                onFocus={handleInputClick} 
                error={isError}
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
                keyExtractor={(item) => item.id.toString()} 
              />
              </View>
              <TextInput
                style={styles.quantityInput}
                placeholder={selectedUthang.quantity.toString()}
                label="Quantity"
                mode="outlined"
                value={quantity.toString()}
                onChangeText={setQuantity}
                error={isError}
              />

              <View style={styles.actionButton}>
                <TouchableOpacity>
                  <Button
                    disabled={loading}
                    loading={loading}
                    style={{ backgroundColor: "#13C913" }}
                    onPress={handleSave}
                  >
                    <Text style={{ color: "white" }}>Save</Text>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGoBack}
                >
                  <Button style={{ backgroundColor: "#DB0202" }}>
                    <Text style={{ color: "white" }}>Cancel</Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default ViewDebtRecord;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#BAE8E8",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#BAE8E8",
    paddingTop: 100,
    paddingBottom: 300,
  },
  contentContainer: {
    flex: 1,
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
  autoCompleteContainer: {
    position: "relative",
    zIndex: 1,
    marginBottom: 10,
    width: "100%",
  },
  autoComplete: {
    height: 40, 
    marginBottom: 10,
    width: "100%", 
  },

  quantityInput: {
    height: 50, 
    marginBottom: 10,
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    marginLeft: 140,
    gap: 5,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFD803",
  },
  suggestionItem: {
    height: 40, // Adjust the height according to your preference
    paddingVertical: 10, // Adjust the vertical padding according to your preference
    paddingHorizontal: 15, // Adjust the horizontal padding according to your preference
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
});
