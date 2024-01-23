import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const AboutUs = () => {
  const handlePress = () => {
    const url = "https://www.facebook.com/markjundy.juaton";
    Linking.openURL(url);
  };
  const handlePressTwitter = () => {
    const url = "https://twitter.com/?lang=en";
    Linking.openURL(url);
  };
  const handlePressInstagram = () => {
    const url =
      "https://www.instagram.com/markjundy?igsh=MzNlNGNkZWQ4Mg%3D%3D&fbclid=IwAR1J2cbKP7Ob9ly7gAa8hhRL9SC5662LrcxwSECOvJobrEfsP__dTdMAMgs";
    Linking.openURL(url);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>OUR TEAM</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image
            style={styles.tinyLogo}
            source={require("./pictures/Buwanding_Aladdin.jpg")}
          />
          <Text style={styles.memberName}>Buwanding, Aladdin</Text>
          <Text style={styles.memberRole}>Hacker</Text>
          <Text style={styles.memberDescription}>
            Group Leading Computer hacker, responsible for debugging and
            checking for errors in the code.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image
            style={styles.tinyLogo}
            source={require("./pictures/Juaton.png")}
          />
          <Text style={styles.memberName}>Juaton, Mark Jundy</Text>
          <Text style={styles.memberRole}>Team Leader</Text>
          <Text style={styles.memberDescription}>
            Group Leader, responsible for leading and checking the progress in
            the project.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image
            style={styles.tinyLogo}
            source={require("./pictures/Alingig.png")}
          />
          <Text style={styles.memberName}>Alingig, Raphael</Text>
          <Text style={styles.memberRole}>Managing Director</Text>
          <Text style={styles.memberDescription}>
            Group Manager, responsible for creating timelines, managing tasks,
            and checking the group's progress, assisting the group leader.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image
            style={styles.tinyLogo}
            source={require("./pictures/Ibarra.png")}
          />
          <Text style={styles.memberName}>Ibarra, Ray Anthony</Text>
          <Text style={styles.memberRole}>Designer</Text>
          <Text style={styles.memberDescription}>
            Group Designer, responsible for UI design in the program.
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Contact us at: markjundyjuaton01@gmail.com
            </Text>
          </View>
          <View style={styles.socialIcons}>
            <Ionicons
              onPress={handlePress}
              name="logo-facebook"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Ionicons
              onPress={handlePressTwitter}
              name="logo-twitter"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Ionicons
              onPress={handlePressInstagram}
              name="logo-instagram"
              size={24}
              color="#fff"
              style={styles.icon}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BAE8E8",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  section: {
    marginBottom: 20,
  },

  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textDecorationLine: "underline",
    textShadowRadius: 10,
    textAlign: "center",
  },

  memberContainer: {
    backgroundColor: "#B2DFEB",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
    alignItems: "center",
  },

  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },

  memberRole: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    justifyContent: "center",
    textAlign: "center",
    textDecorationLine: "underline",
    fontStyle: "italic",
    fontWeight: "bold",
  },

  memberDescription: {
    fontSize: 14,
    color: "#000000",
    textAlign: "justify",
    padding: 10,
  },
  // FOOTER
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    shadowOpacity: 80,
    elevation: 15,
  },
  footerContent: {
    flex: 1,
  },
  footerText: {
    color: "#fff",
  },
  socialIcons: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
});
