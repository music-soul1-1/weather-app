//#region Imports
import React, {useEffect} from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import AddWeatherScreen from './screens/AddWeatherScreen';
import InfoScreen from './screens/InfoScreen';
import SettingsScreen from './screens/SettingsScreen';
import {theme, CombinedDarkTheme, CombinedDefaultTheme} from './modules/theme';
import { loadSettings } from './modules/WeatherApiHandler';

import {
  Provider as PaperProvider,
} from 'react-native-paper';

import {
  NavigationContainer,
} from '@react-navigation/native';
//#endregion

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme(); // gets system theme mode

  useEffect(() => {
    loadSettings();
    console.log("loaded");
  }, []);

  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <NavigationContainer theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
        <Stack.Navigator 
          initialRouteName='Main' 
          screenOptions={{
            headerShown: false, 
            headerShadowVisible: false, 
            headerTransparent: true,
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen 
            name="Main"
            component={MainScreen}
          />
          <Stack.Screen
            name="AddWeather"
            component={AddWeatherScreen}
            options={{
              title: 'Add weather', 
              headerShown: true, 
              headerShadowVisible: true, 
              headerTransparent: false,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[80]
              } 
            }}
          />
          <Stack.Screen 
            name="InfoScreen"
            component={InfoScreen}
            options={{ 
              title: 'App info', 
              headerShown: true, 
              headerShadowVisible: true, 
              headerTransparent: false,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[80]
              } 
            }}
          />
          <Stack.Screen 
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ 
              title: 'Settings', 
              headerShown: true, 
              headerShadowVisible: true, 
              headerTransparent: false,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[80]
              } 
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
