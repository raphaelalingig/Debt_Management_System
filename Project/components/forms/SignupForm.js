import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { TextInput, Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Intro from "../pages/Intro";

const SignupForm = () => {
  const [text, setText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState(""); // Add this line
  const [password, setPassword] = React.useState(""); // Add this line
  const [repassword, setRepassword] = React.useState(""); // Add this line
  const [showPass, setShowPass] = React.useState(false);
  const [showRePass, setShowRePass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const navigation = useNavigation();

  const showToast = (message = "Something wen't wrong") => {
    ToastAndroid.show(message, 3000);
  };
  const handleRegistration = async () => {
    try {
      setLoading(true);

      if (name === "" || email === "" || password === "" || repassword === "") {
        showToast("Please input required data");
        setIsError(true);
        return false;
      }

      if (password !== repassword) {
        showToast("Please match the password");
        setIsError(true);
        return false;
      }

      const result = await fetchServices.postData(url, data);

      if (result?.message != null) {
        showToast(result?.message);
      } else {
        navigation.navigate("LoginForm");
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card style={styles.container}>
      <View style={styles.textRegister}>
        <Text style={styles.textTitle}>Register</Text>
        <Text style={{ textDecorationLine: "underline" }}>
          Create your new account
        </Text>
      </View>
      <TextInput
        label="Full Name:"
        value={name}
        mode="outlined"
        onChangeText={setName}
        left={<TextInput.Icon icon="account" />}
        error={isError}
      />
      <TextInput
        label="Email:"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        left={<TextInput.Icon icon="email" />}
        error={isError}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry={!showPass}
        right={
          <TextInput.Icon
            icon={showPass ? "eye" : "eye-off"}
            onPress={() => setShowPass(!showPass)}
          />
        }
        left={<TextInput.Icon icon="key" />}
        onChangeText={setPassword}
        error={isError}
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry={!showRePass}
        right={
          <TextInput.Icon
            icon={showRePass ? "eye" : "eye-off"}
            onPress={() => setShowRePass(!showRePass)}
          />
        }
        error={isError}
        left={<TextInput.Icon icon="account-key" />}
        onChangeText={setRepassword}
      />
      <Text>By signing you agree to our Team of use and privacy notice</Text>
      <View style={styles.signupContainer}>
        <Text variant="bodyMedium">Already have an account? </Text>
        <TouchableOpacity>
          <Text
            variant="bodyMedium"
            onPress={() => navigation.navigate("LoginForms")}
            style={{ color: "#008686" }}
          >
             Login?
          </Text>
        </TouchableOpacity>
      </View>
      <Card.Actions style={{ marginTop: 10 }}>
        <Button
          style={{ borderColor: "#FFD803" }}
          disabled={loading}
          onPress={() => navigation.navigate("Intro")}
        >
          <Text style={{ color: "black" }}>Back</Text>
        </Button>
        <Button
          style={{ backgroundColor: "#FFD803" }}
          disabled={loading}
          onPress={handleRegistration}
        >
          <Text style={{ color: "black" }}>Register</Text>
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BAE8E8",
  },
  textTitle: {
    fontSize: 32,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#FFD803",
    borderRadius: 20,
    marginBottom: 10,
  },
  textRegister: {
    alignItems: "center",
    marginBottom: 10,
  },
  signupContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
});
