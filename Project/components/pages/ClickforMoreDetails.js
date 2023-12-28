import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import API_URL from "../services/apiurl";

const ClickforMoreDetails = ({ route, navigation }) => {
  const { debtorInfo } = route.params;
  const [uthangsData, setUthangsData] = useState([]);

  const fetchData = useCallback(() => {
    if (debtorInfo.d_id) {
      axios
        .get(API_URL + 'uthangs/' + debtorInfo.d_id)
        .then((response) => {
          setUthangsData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching uthangs data:', error);
        });
    }
  }, [debtorInfo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("ClickforMoreDetails", { debtorInfo });
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isFocused]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      fetchData();
    });

    return () => {
      focusListener();
    };
  }, [navigation, fetchData]);

  // Calculate the Grand Total
  const grandTotal = uthangsData
  .filter(item => typeof item.total === 'number' || (typeof item.total === 'string' && item.total.trim() !== ''))
  .reduce((sum, item) => sum + parseFloat(item.total), 0);


  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Display debtor details */}
          <View style={styles.displayPicture}>
            <EvilIcons name="user" size={256} color="black" />
          </View>
          <View style={styles.details}>
            <Text>Name: {debtorInfo.d_name}</Text>
            <Text>Phone: {debtorInfo.phone}</Text>
            <Text>Address: {debtorInfo.address}</Text>
            {/* Display other details as needed */}
          </View>
          <View style={{ flexDirection: "row", marginTop: 15, gap: 5 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ViewTransaction", { debtorInfo })}
            >
              <Text style={styles.buttonText}>Transactions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("EditProfile", { debtorInfo })}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Display Uthangs data */}
        <View style={styles.tableDebt}>
          {uthangsData?.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title>Quantity</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Total</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
              </DataTable.Header>
              {uthangsData.map((item) => (
                <TouchableOpacity
                  key={item.u_id}
                  onPress={() =>
                    navigation.navigate("ViewDebtRecord", {
                      uthangInfo: item, debtorInfo 
                    })
                  }
                >
                  <DataTable.Row>
                    <DataTable.Cell>{item.item_name}</DataTable.Cell>
                    <DataTable.Cell>{item.quantity}</DataTable.Cell>
                    <DataTable.Cell>₱{item.price}</DataTable.Cell>
                    <DataTable.Cell>{item.total}</DataTable.Cell>
                    <DataTable.Cell>{item.date}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
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
                  <Text style={styles.tableTitle}> ₱{grandTotal}.00</Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          ) : (
            <Text style={styles.noUthangsText}>NO UTHANGS TO SHOW</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("AddUtang", { debtorInfo })}>
          <AntDesign
            style={styles.plusButton}
            name="pluscircle"
            size={58}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>  
  );
};

export default ClickforMoreDetails;

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
  tableDebt: {
    padding: 5,
    backgroundColor: "white",
    width: 370,
    borderRadius: 30,
    marginTop: 10,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  noUthangsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  plusButton: {
    margin: 20,
    marginTop: 20,
    bottom: "1%",
  },
  button: {
    backgroundColor: "#FFD803",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
