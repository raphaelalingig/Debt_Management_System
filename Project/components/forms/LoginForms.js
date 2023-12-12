import { StyleSheet, TouchableOpacity, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { Button, Card, TextInput, Text, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";

import Intro from "../pages/Intro";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigation = useNavigation();

  const showToast = (message = "Something went wrong") => {
    ToastAndroid.show(message, 3000);
  };

  const handleForgotPasswordPress = () => {
    // Navigate to the ForgotPage screen
    navigation.navigate("ForgotPage");
  };
  const ClickableText = ({ onPress, text }) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ color: "blue", textDecorationLine: "underline" }}>
        {text}
      </Text>
    </TouchableOpacity>
  );

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
          await handleLogin(values);
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
              <Text variant="displayMedium">Welcome Back</Text>
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
                <Button
                  disabled={isSubmitting}
                  onPress={() => navigation.navigate("Intro")}
                  icon="keyboard-backspace"
                  mode="contained"
                  style={{ marginTop: 10, backgroundColor: "#FFD803" }}
                >
                  <Text>Back</Text>
                </Button>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onPress={() => navigation.navigate("MainPage")}
                  icon="login"
                  mode="contained"
                  style={{ marginTop: 10, backgroundColor: "#FFD803" }}
                >
                  <Text>Login</Text>
                </Button>
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
});
