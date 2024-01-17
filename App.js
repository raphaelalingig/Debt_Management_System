import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Intro from "./components/pages/Intro";
import NavigationStack from "./components/navigation/NavigationStack";
import "react-native-reanimated";
import { useSharedValue, withSpring } from "react-native-reanimated";

const App = () => {
  return (
    <PaperProvider style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#BAE8E8" }}>
        <NavigationStack />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
