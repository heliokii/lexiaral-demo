import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import { Art } from './src/Art';
import { stopAudio } from './src/audio';
import { LearningProvider } from './src/state/LearningProvider';

import LevelsScreen from './src/screens/LevelsScreen';

import {
  ActivityScreen,
  ResultsScreen,
} from './src/screens/LearningScreens';

import {
  AboutScreen,
  BadgesScreen,
  FinalScreen,
  HomeScreen,
  ProgressScreen,
  ReviewScreen,
  WelcomeScreen,
} from './src/screens/DashboardScreens';

const Stack = createNativeStackNavigator();

function FontLoadingScreen({ error }) {
  return (
    <View style={styles.loading}>
      <Art name="owl-reading" width={200} height={220} />

      <Text style={styles.loadingTitle}>LEXIARAL</Text>
      <Text style={styles.loadingText}>Learn Words. Play. Grow.</Text>

      {error ? (
        <Text style={styles.loadingText}>
          The font could not be loaded. Please close and reopen the app.
        </Text>
      ) : (
        <ActivityIndicator color="#947BDD" size="large" />
      )}
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded || fontError) {
    return <FontLoadingScreen error={fontError} />;
  }

  return (
    <SafeAreaProvider>
      <LearningProvider>
        <StatusBar style="dark" />

        <NavigationContainer onStateChange={stopAudio}>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#F2EEFD' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Levels" component={LevelsScreen} />

            <Stack.Screen
              name="Activity"
              component={ActivityScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params?.title || 'Let’s Learn',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#EAE9FC' },
                headerTintColor: '#8065CE',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 18,
                  color: '#3E3B50',
                },
              })}
            />

            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{
                headerShown: true,
                title: 'My Result',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#EAE9FC' },
                headerTintColor: '#8065CE',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 18,
                },
              }}
            />

            <Stack.Screen name="Final" component={FinalScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Badges" component={BadgesScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LearningProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#EDE8FC',
    gap: 18,
  },
  loadingTitle: {
    fontSize: 33,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#8065CE',
  },
  loadingText: {
    fontSize: 17,
    color: '#777089',
    textAlign: 'center',
  },
});