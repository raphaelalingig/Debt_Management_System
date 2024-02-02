import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ToastAndroid } from 'react-native';
import API_URL from "../services/apiurl";
import axios from 'axios';

const Settings = () => {
  const [editable, setEditable] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    overallLimit: 0,
    debtorLimit: 0,
    interestMultiplier: 0,
  });
  const [overallLimit, setOverallLimit] = useState(0);
  const [debtorLimit, setDebtorLimit] = useState(0);
  const [interestMultiplier, setInterestMultiplier] = useState(0);
  const [loading, setLoading] = useState(false);

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL + "overAllLimit");
      const result = await response.json();
      setOverallLimit(result.amount);

      const response2 = await fetch(API_URL + "debtorLimit");
      const result2 = await response2.json();
      setDebtorLimit(result2.amount);

      const response3 = await fetch(API_URL + "interest");
      const result3 = await response3.json();
      setInterestMultiplier(result3.amount);

      // Save the original values when fetching data
      setOriginalValues({
        overallLimit: result.amount,
        debtorLimit: result2.amount,
        interestMultiplier: result3.amount,
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const handleUpdatePress = () => {
    setEditable(true);
  };

  const handleSavePress =  async () => {
    setLoading(true);

    if (
      overallLimit === originalValues.overallLimit &&
      debtorLimit === originalValues.debtorLimit &&
      interestMultiplier === originalValues.interestMultiplier
    ){
      setEditable(false);
      setLoading(false);
      return;
    }
    try {
      if (overallLimit > 5001) {
        showToast("Inventory limit Maxed at 5000");
        return;
      }
      if (debtorLimit > 3001) {
        showToast("Debtor limit Maxed at 3000");
        return;
      }
      if (interestMultiplier > 0.2) {
        showToast("Interest Maxed at 20%");
        return;
      }
      const url = API_URL + "updatelimit/";
      const data = {
        overallLimit,
        debtorLimit,
        interestMultiplier,
      };
  
      console.log("Request URL:", url);
      const result = await axios.put(url, data);
  
      if (result?.data?.message === "Updated successfully") {
        showToast(result?.data?.message);
        console.log(result?.data?.message);
        setEditable(false);
        await fetchData();
      } else {
        // Handle error if needed
        console.log(result?.data?.error || result?.data?.message);
        showToast("Failed to update");
      }
  
    } catch (e) {
      showToast("Something went wrong");
      console.error(e);
    } finally {
      setLoading(false);
    }


    console.log("Save button pressed");
  };

  const handleCancelPress = async () => {
    setEditable(false);
    await fetchData();
    console.log("Cancel button pressed");
  };


  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Text style={styles.label}>Over All Limit</Text>
        <View style={[styles.priceBox, editable ? styles.editablePriceBox : null]}>
          {editable ? (
            <TextInput
              style={styles.editablePrice}
              value={overallLimit}
              onChangeText={setOverallLimit}
            />
          ) : (
            <Text style={styles.price}>₱{overallLimit}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.label}>Each Debtor Limit</Text>
        <View style={[styles.priceBox, editable ? styles.editablePriceBox : null]}>
          {editable ? (
            <TextInput
              style={styles.editablePrice}
              value={debtorLimit}
              onChangeText={setDebtorLimit}
            />
          ) : (
            <Text style={styles.price}>₱{debtorLimit}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.label}>Overdue Interest Multiplier</Text>
        <View style={[styles.priceBox, editable ? styles.editablePriceBox : null]}>
          {editable ? (
            <TextInput
              style={styles.editablePrice}
              value={interestMultiplier}
              onChangeText={setInterestMultiplier}
            />
          ) : (
            <Text style={styles.price}>₱{interestMultiplier}</Text>
          )}
        </View>
      </View>
      {editable ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSavePress} style={styles.saveButton} 
          disabled={loading}
          loading={loading}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}
          disabled={loading}
          loading={loading}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handleUpdatePress} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceBox: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  editablePriceBox: {
    backgroundColor: '#e6e6e6',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editablePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings;
