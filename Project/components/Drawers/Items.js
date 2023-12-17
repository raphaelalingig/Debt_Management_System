// Items.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';
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
        console.error('Error fetching data:', error.message);
        // Check if error has a response property before accessing data
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
    <View>
      <Text style={styles.header}>Debtor List</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.debtorBox}>
            <Text>Name: {item.item_name}</Text>
            <Text>Price: {item.price}</Text>
            {item.category ? (
              <Text>Category: {item.category.category_name}</Text>
            ) : (
              <Text>No category data</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debtorBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
  },
});

export default ItemsComponent;
