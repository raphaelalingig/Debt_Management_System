import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { DataTable, Text, Button, TextInput, TouchableRipple } from "react-native-paper";
import axios from "axios";
import SalesInfoModal from "../Drawers/SalesInfo";
import API_URL from "../services/apiurl";
import moment from "moment";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [originalSales, setOriginalSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL + "sales");
        setSales(response.data);
        setOriginalSales(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Response data:", error.response.data);
      }
    };

    fetchData();
  }, []);

  const grandTotal = sales
    .filter(
      (item) =>
        typeof item.price === "number" ||
        (typeof item.price === "string" && item.price.trim() !== "")
    )
    .reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCancel = () => {
    setIsModalVisible(false);
    setSearchMode(false); // Cancel search mode
    setSearchDate(""); // Clear search date
  };

  const filterTodaySales = () => {
    const todaySales = originalSales.filter((item) =>
      moment(item.sale_date).isSame(moment(), "day")
    );
    setSales(todaySales);
  };

  const showAllSales = async () => {
    try {
      const response = await axios.get(API_URL + "sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Response data:", error.response.data);
    }
  };

  const searchByDate = () => {
    const searchedSales = originalSales.filter((item) =>
      moment(item.sale_date).isSame(moment(searchDate), "day")
    );
    setSales(searchedSales);
  };

  return (
    <ScrollView>
      <View style={styles.tableSales}>
        {searchMode ? (
          <View style={styles.searchContainer}>
            <TextInput
            style={styles.searchbox}
              label="Search Date"
              value={searchDate}
              onChangeText={(text) => setSearchDate(text)}
            />
            <Button mode="contained" onPress={searchByDate}>
              Search
            </Button>
            <Button mode="outlined" onPress={handleCancel}>
              Cancel
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={showAllSales}>
              All
            </Button>
            <Button mode="contained" onPress={filterTodaySales}>
              Today
            </Button>
            <Button mode="contained" onPress={() => setSearchMode(true)}>
              Search Date
            </Button>
          </View>
        )}

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
                setSelectedSale(item);
                setIsModalVisible(true);
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
  tableSales: {
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    alignItems: "center",
  },
  tableTitle: {
    fontWeight: "bold",
  },
  noSalesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  searchbox: {
    marginRight: 10,
    width: "40%",
  }
});