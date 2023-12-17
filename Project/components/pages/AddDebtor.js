import { View, StyleSheet, ToastAndroid, BackHandler } from "react-native";
import { TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import fetchServices from "../services/fetchServices";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import API_URL from "../services/apiurl";

const AddDebtor = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [d_name, setDebtorName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };


  const handleInsertDebtor = async () => {
    try {
      setLoading(true);

      if (d_name === "" || phone === "" || address === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      const url = API_URL+"insertdebtors";
      const data = {
        d_name,
        phone,
        address,
      };
 

      const result = await fetchServices.postData(url, data);
      
      if (result?.message != "Debtor added successfully") {
        showToast(result?.message);
        console.log(result?.message);
      } 
      if (result?.message == "Debtor added successfully"){
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
        navigation.navigate("MainPage");
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.displayPicture}>
          <EvilIcons name="user" size={256} color="black" />
        </View>
        <View style={styles.details}>
          <TextInput
            style={{ height: 30 }}
            placeholder="Name: "
            label="Name: "
            mode="outlined"value={d_name}
            onChangeText={setDebtorName}
            error={isError}
          />
          <TextInput
            style={{ height: 30 }}
            placeholder="Phone Number: "
            label="Phone Number: "
            mode="outlined"
            value={phone}
            onChangeText={setPhone}
            error={isError}
          />
          <TextInput
            style={{ height: 30 }}
            placeholder="Address: "
            label="Address: "
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            error={isError}
          />
          <View style={{ marginTop: 20, gap: 5 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MainPage")}
            >
              <Button style={styles.button}>Cancel</Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button 
                style={styles.button}
                disabled={loading}
                loading={loading}
                onPress={handleInsertDebtor}>
                  Save
                  </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddDebtor;

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
