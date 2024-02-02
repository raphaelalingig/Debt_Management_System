
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TransactionInfoModal = ({ isVisible, onCancel, TransacDetails }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onCancel()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Transaction Details</Text>
          {TransacDetails && (
            <>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Id:</Text>
                <Text style={styles.detailValue}>{TransacDetails.h_id}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Transaction:</Text>
                <Text style={styles.detailValue}>{TransacDetails.transaction}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Debtor:</Text>
                <Text style={styles.detailValue}>{TransacDetails.name}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{TransacDetails.date}</Text>
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onCancel()}>
              <Text style={styles.buttonText}>Close</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    flexBasis: '30%',
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'right',
  },
  detailValue: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TransactionInfoModal;
