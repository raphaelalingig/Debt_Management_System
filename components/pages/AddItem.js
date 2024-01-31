import { View, StyleSheet, ToastAndroid, BackHandler } from "react-native";
import { TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import fetchServices from "../services/fetchServices";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import API_URL from "../services/apiurl";

const AddItem = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [item, setItem] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleInsertDebtor = async () => {
    try {
      setLoading(true);

      if (item === "" || price === "" || category === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      const url = API_URL + "insert_items";
      const data = {
        item,
        price,
        category,
      };

      const result = await fetchServices.postData(url, data);

      if (result?.message != "Debtor added successfully") {
        showToast(result?.message);
        console.log(result?.message);
      }
      if (result?.message == "Debtor added successfully") {
        showToast(result?.message);
        console.log(result?.message);
        navigation.navigate("MainPage");
        console.log("Navigating to MainPage");
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("Items");
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Item: "
            label="Item: "
            mode="outlined"
            value={item}
            onChangeText={setItem}
            error={isError}
          />
          <TextInput
            style={{ height: 30 }}
            placeholder="Price: "
            label="Price: "
            mode="outlined"
            value={price}
            onChangeText={setPrice}
            error={isError}
          />
          <TextInput
            style={{ height: 30 }}
            placeholder="Category: "
            label="Category "
            mode="outlined"
            value={category}
            onChangeText={setCategory}
            error={isError}
          />
          
          <View
            style={{
              marginTop: 20,
              gap: 5,
              flexDirection: "row",
              marginLeft: 120,
            }}
          >
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Button style={styles.button}>
                <Text style={{ color: "white" }}>Cancel</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button
                style={{ backgroundColor: "green" }}
                disabled={loading}
                loading={loading}
                onPress={handleInsertDebtor}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddItem;

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
});
