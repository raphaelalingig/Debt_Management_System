import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import User_MainPage from "./User_UI/components/UserHeader";
import { PaperProvider } from 'react-native-paper';
import MainPage from "./User_UI/pages/MainPage";

export default function UserApp() {
  return (
    <PaperProvider>
      <SafeAreaView > 
        <MainPage/>
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
