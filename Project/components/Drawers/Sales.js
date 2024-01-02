import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable, Text, Button, TouchableRipple } from "react-native-paper";
import React, { useState } from "react";
import { useFocusEffect, useEffect } from '@react-navigation/native'; // Import useFocusEffect
import axios from 'axios';
import SalesInfoModal from "../Drawers/SalesInfo";
import API_URL from "../services/apiurl";

const Sales = () => {
  const [sales, setSales] = useState([]); // Define salesData state variable
  const [selectedSale, setSelectedSale] = useState(null); // Add a state variable for the selected sale
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
      // Fetch data from the Laravel API endpoint
      axios
        .get(API_URL + 'sales')
        .then((response) => {
          setSales(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          console.error('Response data:', error.response.data);
        });
    }, []) // The empty dependency array ensures that this effect runs only once when the component mounts
  );



  const grandTotal = sales
    .filter(item => typeof item.price === 'number' || (typeof item.price === 'string' && item.price.trim() !== ''))
    .reduce((sum, item) => sum + parseFloat(item.price), 0);

    const handleCancel = () => {
      // Handle the "No" button click
      setIsModalVisible(false);
    };
  return (
    <ScrollView>
      <View style={styles.tableSales}>
        {sales?.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Id</DataTable.Title>
              <DataTable.Title>Item</DataTable.Title>
              <DataTable.Title>Quantity</DataTable.Title>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title>Debtor</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
            </DataTable.Header>
            
            {sales.map((item) => (
            <TouchableRipple
              key={item.sale_id}
              onPress={() => {
                setSelectedSale(item); // Set the selected sale
                setIsModalVisible(true); // Show the modal
              }}
            >
              <DataTable.Row>
                <DataTable.Cell>{item.sale_id}</DataTable.Cell>
                <DataTable.Cell>{item.item_name}</DataTable.Cell>
                <DataTable.Cell>{item.quantity_sold}</DataTable.Cell>
                <DataTable.Cell>₱{item.price}</DataTable.Cell>
                <DataTable.Cell>{item.debtor_name}</DataTable.Cell>
                <DataTable.Cell>{item.sale_date}</DataTable.Cell>
              </DataTable.Row>
            </TouchableRipple>
          ))}

            {/* Grand Total Row */}
            <DataTable.Row>
              <DataTable.Cell></DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.tableTitle}>Grand Total:</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.tableTitle}> ₱{grandTotal.toFixed(2)}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        ) : (
          <Text style={styles.noSalesText}>NO CURRENT SALES TO SHOW</Text>
        )}
        <SalesInfoModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          saleDetails={selectedSale}
        />
      </View>
    </ScrollView>
  );
};

export default Sales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
  },
  table: {
    padding: 5,
    backgroundColor: "white",
    margin: "5",
  },
  tableSales: {
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 30,
    marginTop: 10,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  noSalesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
