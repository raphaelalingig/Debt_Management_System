import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { PaperProvider } from "react-native-paper";
import MainPage from "./User_UI/pages/MainPage";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./User_UI/navigation/BottomNavigation";

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <BottomNavigation />
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
    alignItems: "center",
  },
});
