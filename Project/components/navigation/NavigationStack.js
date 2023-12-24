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
import ClickforMoreDetails from "../pages/ClickforMoreDetails";
import EditProfile from "../pages/EditProfile";
import ViewDebtRecord from "../pages/ViewDebtRecord";
import AddDebtor from "../pages/AddDebtor";
import Transactions from "../pages/Transactions";
import ViewTransaction from "../pages/ViewTransaction";
import AddUtang from "../pages/AddUtang";
import Auto from "../pages/Confirmation";
import Edit from "../pages/Edit";



const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => (
  <Drawer.Navigator>
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
      <Stack.Navigator initialRouteName="Intro">
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
          name="ClickforMoreDetails"
          component={ClickforMoreDetails}
          options={{
            title: "Records",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: "Edit Profile",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="ViewDebtRecord"
          component={ViewDebtRecord}
          options={{
            title: "View Debt Record",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{
            title: "View Debt Record",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="AddDebtor"
          component={AddDebtor}
          options={{
            title: "Add Debtor",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{
            title: "Transactions",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="ViewTransaction"
          component={ViewTransaction}
          options={{
            title: "View Transaction",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="AddUtang"
          component={AddUtang}
          options={{
            title: "Add Debt Items",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="Auto"
          component={Auto}
          options={{
            title: "Add Debt Items",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
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