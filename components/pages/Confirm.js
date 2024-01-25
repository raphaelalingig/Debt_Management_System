import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

const ConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onCancel()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text variant="titleLarge" style={{margin: 20}}>Are you sure?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onConfirm()}>
              <Button>
                <Text style={styles.buttonText}>Yes</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button_no}
              onPress={() => onCancel()}
            >
              <Button>
                <Text style={styles.buttonText}>No</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  button_no: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ConfirmationModal;
