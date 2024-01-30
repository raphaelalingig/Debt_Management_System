import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import axios from "axios";
import API_URL from "../services/apiurl";
import { Button, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const ItemsComponent = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the Laravel API endpoint
    axios
      .get(API_URL + "items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
        setError(error.message);
      });
  }, []);

  if (error) {
    return (
      <View>
        <Text>Error fetching data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Item Name</Text>
        <Text style={styles.tableHeaderText}>Price</Text>
        <Text style={styles.tableHeaderText}>Category</Text>
        <Text style={styles.tableHeaderText}>Action</Text>
      </View>
      {items.map((item) => (
        <View key={item.item_id} style={styles.tableRow}>
          <Text style={styles.tableRowText}>{item.item_name}</Text>
          <Text style={styles.tableRowText}>{item.price}</Text>
          <Text style={styles.tableRowText}>{item.category}</Text>

          <TouchableOpacity style={styles.tableRowTextAction}>
            <Text variant="bodySmall" style={{}}>
              Edit Product
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.plusButtonContainer}>
        <AntDesign
          name="pluscircle"
          size={58}
          color="black"
          style={styles.plusButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 10,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    backgroundColor: "#f1f8ff",
    marginHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: "black",
    paddingTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#FFD803",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 30,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
  },
  tableRowText: {
    flex: 1,
    margin: 5,
    textAlign: "center",
  },
  tableRowTextAction: {
    textAlign: "center",
    marginRight: 4,
    borderColor: "#FFD803",
    borderWidth: 1,
    backgroundColor: "#FFD803",
    gap: 5,
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
  },
  plusButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});

export default ItemsComponent;
