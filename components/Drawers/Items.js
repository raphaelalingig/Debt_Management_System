import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import API_URL from "../services/apiurl";

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
      </View>
      {items.map((item) => (
        <View key={item.item_id} style={styles.tableRow}>
          <Text style={styles.tableRowText}>{item.item_name}</Text>
          <Text style={styles.tableRowText}>{item.price}</Text>
          <Text style={styles.tableRowText}>{item.category}</Text>
        </View>
      ))}
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
});

export default ItemsComponent;
