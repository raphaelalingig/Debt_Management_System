import { StyleSheet, TouchableOpacity, ToastAndroid, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  TextInput,
  Text,
  HelperText,
  Checkbox,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useFormik } from 'formik';
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import fetchServices from "../services/fetchServices";
import API_URL from "../services/apiurl";

const LoginForm = () => {

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await handleLogin(values, rememberMe);
    },
    validationSchema: validationSchema,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();


  const saveCredentials = useCallback(async (values) => {
    try {
      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.setItem("userPassword", values.password);
      console.log("Credentials saved successfully");
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  }, []);
  
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPassword = await AsyncStorage.getItem('userPassword');

        if (storedEmail && storedPassword) {
          formik.setValues({ email: storedEmail, password: storedPassword });
          setRememberMe(true);
          console.log('Credentials loaded successfully');
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };

    loadCredentials();
  }, [formik.setValues]);
 
  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleLogin = async (values) => {
    try {
      const url = API_URL + "login";
      const result = await fetchServices.postData(url, values);

      if (result.message != null) {
        showToast(result?.message);
      } else {
        await AsyncStorage.setItem("authToken", result.token);

        if (rememberMe) {
          await saveCredentials(values);
        }

        if (result.role === 1) {
          navigation.replace("MainPage");
        } else if (result.role === 2) {
          navigation.replace("UserMainPage");
        }
      }
    } catch (e) {
      console.error("API Error:", e);
      showToast("Something went wrong. Please try again.");
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const handleRememberMe = () => {
    setRememberMe((prevRememberMe) => {
      return !prevRememberMe;
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#BAE8E8",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Formik
        {...formik}
        onSubmit={formik.handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isValidating,
          errors,
          touched,
          setTouched,
          setValues,
        }) => {
          return (
            <View styles={{ flex: 1 }}>
              <Text
                variant="displaySmall"
                style={{
                  fontStyle: "italic",
                  textDecorationLine: "underline",
                  width: "100%",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                "Welcome Back"
              </Text>

              <Text style={{ fontWeight: "bold", color: "black" }}>
                Log in to your account
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Email"
                label="Email"
                left={<TextInput.Icon icon="email" />}
                style={{ marginTop: 10 }}
                value={formik.values.email}
                keyboardType="email-address"
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                error={formik.errors.email && formik.touched.email}
                onFocus={() => formik.setTouched({ email: true }, false)}
              />
              {errors.email && touched.email && (
                <HelperText type="error" visible={errors.email}>
                  {errors.email}
                </HelperText>
              )}
              <TextInput
                mode="outlined"
                placeholder="Password"
                label="Password"
                left={<TextInput.Icon icon="lock" />}
                secureTextEntry={!showPass}
                right={
                  <TextInput.Icon
                    icon={showPass ? 'eye' : 'eye-off'}
                    onPress={() => setShowPass(!showPass)}
                  />
                }
                style={{ marginTop: 10 }}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                error={formik.errors.password && formik.touched.password}
                onFocus={() => formik.setTouched({ password: true }, false)}
              />
              {errors.password && touched.password && (
                <HelperText type="error" visible={errors.password}>
                  {errors.password}
                </HelperText>
              )}
              <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={handleRememberMe}
              />
                <Text>Remember Me</Text>
              </View>
              <Card.Actions>
                <TouchableOpacity
                  disabled={isValidating}
                  onPress={() => navigation.navigate("Intro")}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#FFD803",
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text style={{ marginLeft: 5 }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  loading={isValidating}
                  disabled={isValidating} 
                  mode="elevated"
                  onPress={handleSubmit}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#FFD803",
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                  }}
                >
                  <MaterialIcons name="login" size={24} color="black" />
                  <Text style={{ marginLeft: 5 }}>Login</Text>
                </TouchableOpacity>
              </Card.Actions>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  signupContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
