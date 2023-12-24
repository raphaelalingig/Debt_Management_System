import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native';

const AboutUs = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>OUR TEAM</Text>
        </View>

        <View style={styles.memberContainer}>
          <Image style={styles.tinyLogo} source={require('./pictures/Buwanding_Aladdin.jpg')} />
          <Text style={styles.memberName}>Aladdin, Buwanding</Text>
          <Text style={styles.memberRole}>Hacker</Text>
          <Text style={styles.memberDescription}>
            Group Leading Computer hacker, responsible for debugging and checking for errors in the code.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image style={styles.tinyLogo} source={require('./pictures/Juaton.png')} />
          <Text style={styles.memberName}>Juaton, Mark Jundy</Text>
          <Text style={styles.memberRole}>Team Leader</Text>
          <Text style={styles.memberDescription}>
            Group Leader, responsible for leading and checking the progress in the project.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image style={styles.tinyLogo} source={require('./pictures/Alingig.png')} />
          <Text style={styles.memberName}>Alingig, Raphael</Text>
          <Text style={styles.memberRole}>Managing Director</Text>
          <Text style={styles.memberDescription}>
            Group Manager, responsible for creating timelines, managing tasks, and checking the group's progress, assisting the group leader.
          </Text>
        </View>

        <View style={styles.memberContainer}>
          <Image style={styles.tinyLogo} source={require('./pictures/Ibarra.png')} />
          <Text style={styles.memberName}>Ibarra, Ray Anthony</Text>
          <Text style={styles.memberRole}>Designer</Text>
          <Text style={styles.memberDescription}>
            Group Designer, responsible for UI design in the program.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  section: {
    marginBottom: 20,
  },

  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    textDecorationLine: 'underline',
    textShadowRadius: 10,
    textAlign: 'center',
  },

  memberContainer: {
    backgroundColor: '#ffe4b5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
    alignItems: 'center',
  },

  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },

  memberRole: {
    fontSize: 16,
    color: '#a9a9a9',
    marginBottom: 5,
    justifyContent: 'center',
    textAlign: 'center',
  },

  memberDescription: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },

  tinyLogo: {
    width: 100,
    height: 100,
  },
});
