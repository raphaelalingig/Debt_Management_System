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
import ResetPasswordScreen from "../Drawers/ResetPassword";
import Reset from "../Drawers/Reset";
import Account from "../Drawers/Account";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ClickforMoreDetails from "../pages/ClickforMoreDetails";
import EditProfile from "../pages/EditProfile";
import ViewDebtRecord from "../pages/ViewDebtRecord";
import AddDebtor from "../pages/AddDebtor";
import Transactions from "../pages/Transactions";
import ViewTransaction from "../pages/ViewTransaction";
import DebtorPage from "../pages/DebtorPage";
import AddUtang from "../pages/AddUtang";
import Auto from "../pages/Confirmation";
import Sales from "../Drawers/Sales";
import SalesInfo from "../Drawers/SalesInfo";
import LogoutScreen from "../Drawers/LogoutScreen";
import Mail from "../Drawers/Mail";
import Mailpage from "../Drawers/OpenMail";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import BottomNavigation from "../USER_UI/navigation/BottomNavigation";

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
        title: "Inventory of Items",
        headerStyle: {
          backgroundColor: "#B2DFEB",
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
        title: "About Us",
        headerStyle: {
          backgroundColor: "#B2DFEB",
        },
      }}
    />
    <Drawer.Screen
      name="Sales"
      component={Sales}
      options={{
        drawerIcon: () => (
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color="black"
          />
        ),
        drawerLabel: "Sales",
        drawerLabelStyle: {
          color: "black",
        },
        title: "Sales",
        headerStyle: {
          backgroundColor: "#B2DFEB",
        },
      }}
    />
    <Drawer.Screen
      name="Logout"
      component={LogoutScreen}
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
      <Stack.Navigator initialRouteName="MainPage">
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
          name="Account"
          component={Account}
          options={{
            title: "Account",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={({ navigation }) => ({
            title: "Reset Password",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  style={styles.mailButton}
                  onPress={() => navigation.navigate("Mail")}
                >
                  <MaterialCommunityIcons
                    name="email"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => navigation.navigate("Logout")}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Reset"
          component={Reset}
          options={{
            title: "Account",
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
          name="SalesInfo"
          component={SalesInfo}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MainPage"
          component={DrawerNavigator}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="UserMainPage"
          component={BottomNavigation}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Logout"
          component={LogoutScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Mail"
          component={Mail}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MailPage"
          component={Mailpage}
        />

        <Stack.Screen
          name="DebtorPage"
          component={DebtorPage}
          options={({ navigation }) => ({
            title: "DebtorPage",
            headerStyle: {
              backgroundColor: "#BAE8E8",
            },
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  style={styles.accountButton}
                  onPress={() => navigation.navigate("Account")}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mailButton}
                  onPress={() => navigation.navigate("Mail")}
                >
                  <MaterialCommunityIcons
                    name="email"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => navigation.navigate("Logout")}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  accountButton: {
    marginRight: 10,
  },
  mailButton: {
    marginRight: 10,
  },
  logoutButton: {},
});
export default NavigationStack;
