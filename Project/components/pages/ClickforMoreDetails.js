import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList} from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { DataTable, Text, Button, TouchableRipple } from "react-native-paper";

import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../services/apiurl";
import EditProfile from "./EditProfile";
import ViewDebtRecord from "./ViewDebtRecord";


const ClickforMoreDetails = ({route, navigation }) => {
  const { debtorInfo, uthangsData } = route.params;
  const debtorId = debtorInfo.d_id;


useEffect(() => {
  axios
    .get(API_URL + "uthangs", {
      params: { debtorId: debtorInfo.d_id },
    })
    .then((response) => {
      setUthangsData(response.data);
      
    })
    .catch((error) => {
      console.error("Error fetching uthangs data:", error);
    });
}, [debtorInfo]);

  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <Text>Name: {debtorInfo.d_name}</Text>
          <Text>Phone: {debtorInfo.phone}</Text>
          <Text>Address: {debtorInfo.address}</Text>
          <Text>Last Updated:</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 15, left: 60, gap: 5 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#FFD803", borderRadius: 20 }}
            onPress={() => navigation.navigate("Transactions")}
          >
            <Button>
              <Text>Transactions</Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#FFD803", borderRadius: 20 }}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Button>
              <Text>Edit Profile</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableDebt}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title>Quantity</DataTable.Title>
            <DataTable.Title>Price</DataTable.Title>
            <DataTable.Title>Total</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
          </DataTable.Header>
          <FlatList
  data={uthangsData}
  keyExtractor={(item) => item.u_id.toString()}
  renderItem={({ item }) => (
    <TouchableRipple onPress={() => navigation.navigate("ViewDebtRecord", { uthangInfo: item })}>
      <DataTable.Row>
        <DataTable.Cell style={{ flex: 2 }}>{item.item_name}</DataTable.Cell>
        <DataTable.Cell numeric style={{ flex: 1, marginRight: 10 }}>
          {item.quantity}
        </DataTable.Cell>
        <DataTable.Cell numeric style={{ flex: 1, marginLeft: 10 }}>
          {item.price}
        </DataTable.Cell>
        <DataTable.Cell numeric style={{ flex: 2, marginRight: 4 }}>
          {item.total}
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: 3, marginLeft: 10 }}>
          {item.date}
        </DataTable.Cell>
      </DataTable.Row>
    </TouchableRipple>
  )}
/>
</DataTable>
          {/* <TouchableRipple
            onPress={() => navigation.navigate("ViewDebtRecord")}
          >
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 2 }}>sample</DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 1, marginRight: 10 }}>
                3
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 1, marginLeft: 10 }}>
                300
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ flex: 2, marginRight: 4 }}>
                500
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 3, marginLeft: 10 }}>
                12/01/2002
              </DataTable.Cell>
            </DataTable.Row>
          </TouchableRipple>
        </DataTable> */}
      </View>
    </View>
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
});
