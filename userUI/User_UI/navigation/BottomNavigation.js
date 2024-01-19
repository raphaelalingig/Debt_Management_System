import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainPage from "../pages/MainPage";
import Settings from "../pages/Settings";
import Transactions from "../pages/Transactions";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({ name, size, color, isFocused }) => {
  const scale = isFocused ? 1.2 : 1;

  return <Ionicons name={name} size={size * scale} color={color} />;
};

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "black",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="Home"
        component={MainPage}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color }}>Home</Text>,
        })}
      />

      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AnimatedIcon
              name="newspaper-outline"
              size={24}
              color={color}
              isFocused={route.state?.index === 1}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color }}>Transactions</Text>
          ),
        })}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={24} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color }}>Settings</Text>,
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
