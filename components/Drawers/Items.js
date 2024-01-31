import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Modal, TextInput } from "react-native";
import axios from "axios";
import API_URL from "../services/apiurl";
import { Button, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const ItemsComponent = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isError, setIsError] = React.useState(false);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCategory, setItemCategory] = useState("");

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  if (error) {
    return (
      <View>
        <Text>Error fetching data: {error}</Text>
      </View>
    );
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!selectedItem?.item_id) {
        console.error("Missing 'item_id' in Items");
        return;
      }
      

      const url = API_URL + "edit_item/" + debtorInfo.d_id;
      const data = {
        d_name: d_name,
        phone: phone,
        address: address,
      };

      if (image) {
        await handleSavePic()
      }
      console.log("Request URL:", url);
      const result = await axios.put(url, data);

      if (result?.data?.debtor) {
        // Access the updated Uthang data
        console.log(result.data.debtor);
        navigation.navigate("MainPage");
      } else {
        // Handle error if needed
        console.log(result?.data?.error || result?.message);
      }
    } catch (e) {
      showToast(e.toString());
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderModalContent = () => {
    if (!selectedItem) {
      return null;
    }

    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <AntDesign name="closecircle" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Edit Item</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Item:</Text>
        </View>
        <View style={styles.detailsContainer}>
        <TextInput
                placeholder={selectedItem.item_name}
                label="Item"
                mode="outlined"
                value={selectedItem.item_name} 
                onChangeText={setItemName}
                error={isError}
              />
              
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Price:</Text>
          <TextInput
                placeholder={selectedItem.price}
                label="Price"
                mode="outlined"
                value={selectedItem.price} 
                onChangeText={setItemPrice}
                error={isError}
              />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Category:</Text>
          <TextInput
                placeholder={selectedItem.price}
                label="Category"
                mode="outlined"
                value={selectedItem.category} 
                onChangeText={setItemCategory}
                error={isError}
              />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.payButton, { marginRight: 10 }]}
            onPress={() => {
              payAmount(balance);
            }}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

          <TouchableOpacity 
            style={styles.tableRowTextAction}
            key={item.item_id}
                    onPress={() => {
                      setSelectedItem(item);
                      navigation.navigate("EditItem", {selectedItem: item});
                    }}
                    underlayColor="#DDDDDD">
            <Text variant="bodySmall" style={{}}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.plusButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddItem")}>
          <AntDesign
            name="pluscircle"
            size={58}
            color="black"
            style={styles.plusButton}
          />
        </TouchableOpacity>
      </View>
      <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView1}>{renderModalContent()}</View>
            </View>
          </Modal>
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
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  
  closeButton: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    left: 130,
  },
});

export default ItemsComponent;
