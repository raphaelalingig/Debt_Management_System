import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import Intro from "../pages/Intro";
import SignupForm from "../forms/SignupForm";
import LoginForm from "../forms/LoginForms";
import MainPage from "../pages/MainPage";
import Items from "../Drawers/Items";
import Aboutus from "../Drawers/AboutUs";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={MainPage}
      options={{
        headerShown: false,
        drawerIcon: () => <FontAwesome5 name="home" size={24} color="black" />,
        drawerLabel: "Home",
        drawerLabelStyle: {
          color: "black",
        },
      }}
    />
    <Drawer.Screen
      name="Inventory of Items"
      component={Items}
      options={{
        drawerIcon: () => (
          <FontAwesome5 name="clipboard-list" size={24} color="black" />
        ),
        drawerLabel: "Inventory of Items",
        drawerLabelStyle: {
          color: "black",
        },
      }}
    />
    <Drawer.Screen
      name="About Us"
      component={Aboutus}
      options={{
        drawerIcon: () => (
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color="black"
          />
        ),
        drawerLabel: "About Us",
        drawerLabelStyle: {
          color: "black",
        },
      }}
    />
    <Drawer.Screen
      name="Logout"
      component={Intro}
      options={{
        headerShown: false,
        drawerIcon: () => (
          <MaterialCommunityIcons name="logout" size={24} color="black" />
        ),
        drawerLabelStyle: {
          color: "black",
        },
      }}
    />
  </Drawer.Navigator>
);

const NavigationStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Intro"
          component={Intro}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignupForm"
          component={SignupForm}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginForms"
          component={LoginForm}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MainPage"
          component={DrawerNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;