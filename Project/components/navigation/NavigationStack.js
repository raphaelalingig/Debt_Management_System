import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Intro from "../pages/Intro";
import SignupForm from "../forms/SignupForm";
import LoginForm from "../forms/LoginForms";

const Stack = createNativeStackNavigator();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;

const styles = StyleSheet.create({});
