import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect} from "react";
import { TextInput, Text, Button } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";
import ConfirmationModal from './Confirmation';
import API_URL from "../services/apiurl";
import axios from "axios";
import { ToastAndroid } from "react-native";


const ViewDebtRecord = ({ navigation, route }) => {
  const { selectedUthang } = route.params;
  const { debtorInfo } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [item_id, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
    setQuantity(selectedUthang.quantity.toString());
    setSuggestions([]);
    setEditedData({ ...editedData, item: item.name, quantity: selectedUthang.quantity.toString() });
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
        console.warn("item_id is null. Setting to default value or handling accordingly.");
        setItemId(selectedUthang.item_id); // Set to a default item_id or handle this case accordingly
      }
  

      const url = API_URL + 'updateutang/' + selectedUthang.u_id;
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
  

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.autoCompleteContainer}>
          <TextInput
              placeholder={selectedUthang.item_name}
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
                placeholder={selectedUthang.quantity.toString()}
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
            
            <TouchableOpacity onPress={() => navigation.navigate("ClickforMoreDetails",{debtorInfo})}>
              <Button 
                style={{ backgroundColor: "red" }}
                disabled={loading}
              loading={loading}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </Button>
            </TouchableOpacity>
          </View>
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
