//#region Imports
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text, View, 
  SafeAreaView, useColorScheme,
} from 'react-native';
import { getLocation, getWeatherData } from '../modules/WeatherApiHandler';
import {   
  MD3DarkTheme, 
  MD3LightTheme,
  adaptNavigationTheme, 
  TextInput,
  Provider as PaperProvider 
} from 'react-native-paper';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import theme from '../modules/theme';
import { styles } from '../modules/styles';
//#endregion


export default function AddWeatherScreen() {
  const colorScheme = useColorScheme(); // gets system theme mode
  const [doesCityExist, setDoesCityExist] = useState(true);
  const [isLabelVisible, setIsLabelVisible] = useState(false);

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      ...theme.schemes.light,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      ...theme.schemes.dark,
    },
  };

  /**
   * Add weather handler. Called inside TextInput.
   * @param city city name.
   */
  async function handleAddWeather(city : string) {
    try {
      const locationData = await getLocation(city);
      if (locationData?.lat) {
        getWeatherData(city);
        setDoesCityExist(true);
      }
      else {
        setDoesCityExist(false);
      }
    }
    catch (error) {
      console.log(error);
    }
    setIsLabelVisible(true);
  }

  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[
            styles.addWeatherContainer, 
            {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[98]}
          ]}>
          <Text style={[
              colorScheme == 'dark' ? styles.darkText : styles.text,
              {marginTop: 50}
            ]}>
            To add weather for a city, please enter it's name
          </Text>
          <TextInput 
            style={[
              styles.textInput, 
              {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[5] : theme.palettes.secondary[90]}
            ]}
            label={'City name'}
            mode='outlined'
            placeholder='Enter city name'
            onEndEditing={(event) => handleAddWeather(event.nativeEvent.text)}
          />
          {isLabelVisible ? (
            <Text style={doesCityExist ? styles.successText :  styles.errorText}>
              {doesCityExist ? "Successfully added." : "Sorry, either this city doesn't exist, or there's no internet connection."}
            </Text>) : 
            (null)
          }          
        </View>
        <View style={[
            styles.container, 
            {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[98]}
          ]}>
        </View>
      </SafeAreaView>
      <StatusBar style='auto' />
    </PaperProvider>
  )
}