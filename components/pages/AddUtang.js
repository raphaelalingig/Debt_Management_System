import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import API_URL from "../services/apiurl";
import fetchServices from "../services/fetchServices";
import { ToastAndroid } from "react-native";


const AddUtang = ({ route, navigation }) => {
  const { debtorInfo } = route.params;
  const [item_id, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputClicked, setIsInputClicked] = useState(false);

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
    setItemId(item.id); // Set the item ID
    setSuggestions([]);
  };

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleAddUtang = async () => {
    try {
      setLoading(true);

      if (query === "" || quantity === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      const url = API_URL + "addutang";
      const data = {
        d_id: debtorInfo?.d_id || "",
        item_id: item_id,
        quantity: quantity,
      };

      const result = await fetchServices.postData(url, data);
      console.log("API Response:", result);
      
      if (result?.error === "Total price exceeds 1000 for this item"){
        showToast("Total price exceeds 1000 for this item");
      } else if (result?.error === "Exceeded maximum total of Debt for this debtor"){
        showToast("Exceeded maximum total of Debt for this debtor");
      } else if (result?.error === "Exceeded maximum total of Debt"){
        showToast("Exceeded maximum total of Debt");
      } else if (result?.message !== "Uthang added successfully") {
        showToast(result);
      } else if (result?.message === "Uthang added successfully"){
        showToast(result?.message);
        navigation.navigate('ClickforMoreDetails', { debtorInfo });
    }
    } catch (e) {
      showToast(e.toString());
      console.error(e);
    } finally {
      setLoading(false);
    }
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
                  placeholder="Item:"
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
                placeholder="Quantity:"
                label="Quantity"
                mode="outlined"
                value={quantity}
                onChangeText={setQuantity}
                error={isError}
              />

              <View style={styles.actionButton}>
              <TouchableOpacity
                  onPress={() =>
                    navigation.pop()
                  }
                >
                  <Button style={{ backgroundColor: "#DB0202" }}>
                    <Text style={{ color: "white" }}>Cancel</Text>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Button
                    disabled={loading}
                    loading={loading}
                    style={{ backgroundColor: "#13C913" }}
                    onPress={handleAddUtang}
                  >
                    <Text style={{ color: "white" }}>Save</Text>
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

export default AddUtang;

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
    height: 40, 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
});