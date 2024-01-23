import { StyleSheet, TouchableOpacity, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
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
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import fetchServices from "../services/fetchServices";
import API_URL from "../services/apiurl";

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [showPass, setShowPass] = React.useState(false);
  const navigation = useNavigation();

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleLogin = async (values, rememberMe) => {
    try {
      const url = API_URL + "login";
      const result = await fetchServices.postData(url, values);

      if (result.message != null) {
        showToast(result?.message);
      } else {
        // Save the token and rememberMe flag to AsyncStorage
        await AsyncStorage.setItem("authToken", result.token);
        await AsyncStorage.setItem("rememberMe", rememberMe.toString());

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
    email: Yup.string()
      .email("Invalid Email")
      .required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

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
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          await handleLogin(values, rememberMe);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
          touched,
          setTouched,
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
                defaultValue={values.email}
                value={values.email}
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email && touched.email}
                onFocus={() => setTouched({ email: true }, false)}
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
                    icon={showPass ? "eye" : "eye-off"}
                    onPress={() => setShowPass(!showPass)}
                  />
                }
                style={{ marginTop: 10 }}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password && touched.password}
                onFocus={() => setTouched({ password: true }, false)}
              />
              {errors.password && touched.password && (
                <HelperText type="error" visible={errors.password}>
                  {errors.password}
                </HelperText>
              )}
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={rememberMe ? "checked" : "unchecked"}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text>Remember Me</Text>
              </View>
              <View style={styles.signupContainer}>
                <Text variant="bodyMedium">Don't have an account? </Text>
                <TouchableOpacity>
                  <Text
                    variant="bodyMedium"
                    onPress={() => navigation.navigate("SignupForm")}
                    style={{ color: "#008686" }}
                  >
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              <Card.Actions>
                <TouchableOpacity
                  disabled={isSubmitting}
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
                  loading={isSubmitting}
                  disabled={isSubmitting}
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
