//#region Imports
import React, { useState, useEffect } from 'react';
import {
  Text, View, 
  ImageBackground, 
  StatusBar,
  SafeAreaView, useColorScheme, 
  ScrollView, RefreshControl, 
  FlatList, Linking } from 'react-native';

import { 
  currentWeather, 
  forecast,
  getWeatherData, 
  capitalizeFirstWord, 
  checkInternetConnection, 
  getForecast,
} from '../modules/WeatherApiHandler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import {
  IconButton,
  Button,
  Divider,
  Provider as PaperProvider 
} from 'react-native-paper';

import {
  useIsFocused,
} from '@react-navigation/native';
import { theme, CombinedDarkTheme, CombinedDefaultTheme } from '../modules/theme';
import { styles } from '../modules/styles';
import { measuringUnits } from '../modules/consts';
import ForecastWidget from '../modules/ForecastWidget';

//#endregion


export default function MainScreen({navigation}: {navigation: any}) {  
  //#region consts and functions
  const colorScheme = useColorScheme(); // gets system theme mode
  const [weatherData, setWeatherData] = useState<currentWeather | null>(null);
  const [forecastData, setForecastData] = useState<forecast | null>(null);
  const [locations, setLocations] = useState<string[]>([]); // array of cities
  const [isRefreshing, setRefreshing] = React.useState(false); // needed for refresh control
  const [isInternetConnected, setIsInternetConnected] = React.useState<boolean | null>(false);
  const isScreenFocused = useIsFocused();

  useEffect (() => {
    // loading locations data on start
    if (isScreenFocused) {
      loadLocations();
    }
  }, [isScreenFocused]);

  useEffect(() => {
    checkConnection(); // checking internet connection on app load
    console.log('connection checked.');
  }, []);

  const checkConnection = async () => {
    const isConnected = await checkInternetConnection();
    setIsInternetConnected(isConnected);
  };

  /**
   * Loads weather data from local storage.
   * @param city city name.
   */
  async function loadWeather(city : string) {
    try {
      const data = await AsyncStorage.getItem(`currentWeatherData/${city}`);
      setWeatherData(data ? JSON.parse(data) : null);
    }
    catch (error) {
      setWeatherData(null);
      console.log("Error loading weather data from local storage.\n" + error);
    }
  };

  /**
   * Loads and sets locations(cities) data from local storage
   */
  async function loadLocations() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const weatherKeys = keys.filter(key => key.startsWith('currentWeatherData/'))
                              .map(key => key.replace('currentWeatherData/', ''));
      setLocations(weatherKeys);
    }
    catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets and sets weather data for specified city.
   * @param location - city name. If not specified or empty - gets weather for current IP
   */
  async function getCurrentWeatherData(location: string = '') {
    try {
      if (isInternetConnected) {
        const weather = await getWeatherData(location);
        setWeatherData(weather);
        loadLocations();
      }
      else {
        // If no internet connection, load the weather data from local storage
        loadWeather(location);
      }
    }
    catch (error) {
      setWeatherData(null);
      console.log('Error in getCurrentWeatherData(): \n' + error);
    }
  };

  /**
   * Removes weather and forecast data for specified city.
   * @param location city name.
   */
  async function removeWeather(location : string) {
    try {
      const indexOfCity = locations.indexOf(location);

      await AsyncStorage.removeItem(`currentWeatherData/${location}`);
      await AsyncStorage.removeItem(`forecastData/${location}`);

      loadLocations();
      if (indexOfCity != -1 && locations.length - 1 > indexOfCity) {
        loadWeather(locations[indexOfCity + 1]);
        loadForecast(locations[indexOfCity + 1]);
      }
      else if (indexOfCity != -1 && location.length - 1 == indexOfCity) {
        loadWeather(locations[indexOfCity - 1]);
        loadForecast(locations[indexOfCity - 1]);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  //console.log(locations);

  /**
   * Refresh handler. Called on page refresh.
   * @param city city name.
   */
  async function onRefresh(city : string) {
    setRefreshing(true);
    // Check if there is an internet connection
    await checkConnection();

    if (isInternetConnected) {
      getCurrentWeatherData(city);
      getForecastData(city);
    }
    else {
      loadForecast(city);
      loadWeather(city);
    }

    setRefreshing(false);
  };

  /**
   * PageSelection handler. Called inside PagerView.
   * @param position index of city in locations[ ].
   */
  async function handlePageSelected(position : number) {
    // Check if there is an internet connection
    await checkConnection();
    
    if (isInternetConnected) {
      getCurrentWeatherData(locations[position]);
      getForecastData(locations[position]);
    }
    else {
      loadWeather(locations[position]);
      loadForecast(locations[position]);
    }
  };

  /** 
   * Loads and sets forecast data from local storage.
   */
  async function loadForecast(city : string) {
    try {
      const data = await AsyncStorage.getItem(`forecastData/${city}`);
      setForecastData(data ? JSON.parse(data) : null);
    }
    catch (error) {
      console.log(error);
    }
  }
  
  /**
   * Gets and sets forecast data.
   * @param city city name
   */
  async function getForecastData(city: string) {
    try {
      if (isInternetConnected) {
        const data = await getForecast(city);
        setForecastData(data);
      } 
      else {
        await loadForecast(city);
      }
    } 
    catch (error) {
      console.log(`getForecastData error:` + error);
    }
  }

  /**
   * Chooses background image based on weather and theme.
   * @returns require(path/to/image)
   */
  const chooseBackground = () => {
    if (colorScheme === 'dark') {
      if (weatherData?.type === 'Clouds' || weatherData?.type === 'Rain') {
        return require('../assets/image-dark.png');
      }
      else {
        return require('../assets/background-dark-no-rain.jpg');
      }
    }
    else {
      if (weatherData?.type === 'Clouds' || weatherData?.type === 'Rain') {
        return require('../assets/image-light.png');
      }
      else {
        return require('../assets/background-light-no-rain.jpg');
      }
    }
  };
  
  //#endregion

  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <SafeAreaView style={styles.safeArea}>
        {locations.length >= 0 ? (
          <PagerView 
            style={[styles.safeArea, {backgroundColor: colorScheme == 'dark' ? CombinedDarkTheme.colors.background : CombinedDefaultTheme.colors.background }]} 
            initialPage={0} 
            orientation={'horizontal'}
            onPageSelected={(event) => handlePageSelected(event.nativeEvent.position)}
            keyboardDismissMode={'on-drag'}
          >
            
            {locations.map(key => (
              <ScrollView 
                key={key}
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl 
                    colors={[theme.coreColors.primary]} 
                    refreshing={isRefreshing} 
                    progressViewOffset={60}
                    onRefresh={() => {onRefresh(key)}} 
                  />
                }
              >
                <ImageBackground
                  key={key} 
                  source={chooseBackground()}
                  resizeMode="cover">
                  
                  {/* Header */}
                  <View key={key} style={styles.container}>
                    <View style={[styles.headerContainer,]}>
                      <IconButton icon={'delete-outline'} size={28} onPress={() => {removeWeather(key)}} />
                      <Text style={{
                        fontSize: key.length >= 16 ?  16 : 24,
                        marginHorizontal: 12,
                        color: colorScheme == 'dark' ? CombinedDarkTheme.colors.secondary : theme.palettes.secondary[30],
                        }}>
                          {key}
                      </Text>
                      <IconButton icon={'plus'} size={28} onPress={() => navigation.navigate('AddWeather')} />
                    </View>
                    
                    {/* Temperature */}
                    <View style={[
                        styles.temperatureContainer,
                        colorScheme == 'dark' ? styles.temperatureContainerDark : styles.temperatureContainerLight
                      ]}>
                      <Text style={[
                          styles.temperature,
                          colorScheme == 'dark' ? styles.temperatureDark : styles.temperatureLight
                        ]}>
                        {weatherData?.temp && Math.round(weatherData.temp)}
                      </Text>
                      <Text style={[
                          {fontSize: 20, marginTop: 8}, 
                          colorScheme == 'dark' ? styles.temperatureDark : styles.temperatureLight
                        ]}>
                          {weatherData?.isMetric ? measuringUnits.metric.temp : measuringUnits.imperial.temp}
                      </Text>
                    </View>
                    
                    <Text style={[
                      colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight,
                      styles.feelsLike,
                    ]}>
                      Feels like {weatherData?.feelsLike ? Math.round(weatherData.feelsLike*10)/10 : 'undef.'}
                      {weatherData?.isMetric ? measuringUnits.metric.temp : measuringUnits.imperial.temp}
                    </Text>
                    
                    <Text style={[
                        styles.description,
                        colorScheme == 'dark' ? styles.descriptionDark : styles.descriptionLight
                      ]}>
                      {weatherData?.description ? capitalizeFirstWord(weatherData?.description) : `undef.`}
                    </Text>

                    {/* Forecast */}
                    <View style={styles.detailsContainer}>
                      <View style={[
                        styles.detailsBox,
                        colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
                      ]}>
                        <Text style={[
                          colorScheme == 'dark' ? styles.forecastLargeLabelDark : styles.forecastLargeLabelLight,
                          {fontSize: 16, marginBottom: 10}
                        ]}>
                          Today's forecast:
                        </Text>

                        <FlatList
                          data={forecastData?.list?.time}
                          horizontal={true}
                          renderItem={({ item, index }) => {
                              return (
                                <ForecastWidget
                                  key={index}
                                  temp={forecastData?.list?.temp[index] ?? ''}
                                  time={forecastData?.list.time[index] ?? ''}
                                  date={forecastData?.list.date[index] ?? ''}
                                  isMetric={weatherData?.isMetric ?? true}
                                  description={forecastData?.list?.description?.[index] ?? ''}
                                  type={forecastData?.list?.type?.[index] ?? ''}
                                  clouds={forecastData?.list?.clouds?.[index]}
                                  rainProbability={forecastData?.list?.rainProbability?.[index]}
                                  windSpeed={forecastData?.list?.windSpeed?.[index]}
                                />
                              );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                        />

                      </View>
                    </View>

                    {/* Details */}
                    <View style={styles.detailsContainer}>
                      <View style={[
                        styles.detailsBox, 
                        colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
                      ]}>
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Wind: {weatherData?.windSpeed} {
                            weatherData?.isMetric ? measuringUnits.metric.speed : measuringUnits.imperial.speed
                          }
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Wind direction: {weatherData?.windDirection}°
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Visibility: {weatherData?.visibility ? Math.round(weatherData?.visibility/1000) : 'undef.'} km
                        </Text>
                        <Divider />
                      </View>

                      <View style={[
                        styles.detailsBox, 
                        colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
                      ]}>
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Humidity: {weatherData?.humidity ? weatherData?.humidity : 'undef.'}%
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Sea pressure: {weatherData?.seaPressure ? weatherData?.seaPressure : 'undef.'} hPa
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Ground pressure: {weatherData?.groundPressure ? weatherData?.groundPressure : 'undef.'} hPa
                        </Text>
                        <Divider />
                      </View>
                    </View>

                    <View style={styles.detailsContainer}>
                      <View style={[
                        styles.detailsBox, 
                        colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
                      ]}>
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Sunrise: {weatherData?.sunrise ? weatherData.sunrise : 'undef.'} 
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Sunset: {weatherData?.sunset ? weatherData?.sunset : 'undef.'}
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Timezone: {weatherData?.timezone ? weatherData?.timezone : 'undef.'}
                        </Text>
                        <Divider />
                      </View>

                      <View style={[
                        styles.detailsBox, 
                        colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
                      ]}>
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Feels like {weatherData?.feelsLike ? Math.round(weatherData.feelsLike*10)/10 : 'undef.'}
                          {weatherData?.isMetric ? measuringUnits.metric.temp : measuringUnits.imperial.temp}
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Rain probability: {forecastData?.list.rainProbability?.[0] ?? 'undef.'}%
                        </Text>
                        <Divider />
                        <Text style={colorScheme == 'dark' ? styles.detailsTextDark : styles.detailsTextLight}>
                          Clouds: {weatherData?.clouds ?? 'undef.'}%
                        </Text>
                        <Divider />
                      </View>
                    </View>
                  </View>
                  <View style={styles.appInfoLabel}>
                    <Button 
                      textColor={colorScheme == 'dark' ? theme.palettes.secondary[70] : theme.palettes.secondary[95]}
                      onPress={() => navigation.navigate('SettingsScreen')}>
                      Settings
                    </Button>
                    <Button
                      textColor={colorScheme == 'dark' ? theme.palettes.secondary[70] : theme.palettes.secondary[95]}
                      onPress={() => Linking.openURL(`https://openweathermap.org`)}>
                      Powered by OpenWeather
                    </Button>
                  </View>
                </ImageBackground>
              </ScrollView>
            ))}
          </PagerView>
        ) : (
          <ScrollView 
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                refreshControl={
                  <RefreshControl 
                    colors={[theme.coreColors.primary]} 
                    refreshing={isRefreshing} 
                    onRefresh={() => {getCurrentWeatherData()}} 
                  />
                }
              >
          <ImageBackground
                  source={colorScheme == 'dark' ? require('../assets/image-dark.png') : require('../assets/image-light.png')} 
                  resizeMode="cover"
                  style={styles.container}>
            <View style={styles.container}>
              <Text style={[
                styles.description,
                {textAlign: 'center'},
                colorScheme == 'dark' ? styles.descriptionDark : styles.descriptionLight]}
              >
                  No internet connection.{'\n'}Please connect to the Internet and refresh this page.
              </Text>
            </View>
          </ImageBackground>
          </ScrollView>
        )}
          
        <StatusBar 
          animated={true} 
          translucent={true} // Android only
          backgroundColor={'rgba(0,0,0,0)'} />
        
      </SafeAreaView>
    </PaperProvider>
  );
};
