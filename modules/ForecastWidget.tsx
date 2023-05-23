//#region Imports
import { View, Text, useColorScheme } from 'react-native';
import { styles }from './styles';
import theme from './theme';
import { capitalizeFirstWord } from './WeatherApiHandler';
import CloudyIcon from '../assets/weather-icons/wi-cloudy.svg';
import LightCloudIcon from '../assets/weather-icons/wi-day-cloudy.svg';
import LightRainIcon from '../assets/weather-icons/wi-rain-mix.svg';
import HeavyRainIcon from '../assets/weather-icons/wi-rain.svg';

//#endregion

type forecastProps = {
  key: string | number;
  temp: number | string;
  time: number | string;
  description: string;
  type: string;
  clouds?: number,
  rainProbability?: number,
  windSpeed?: number,
}

export default function ForecastWidget(props: forecastProps) {
  const colorScheme = useColorScheme(); // gets system theme mode

  /**
   * Chooses which weather icon to render
   * @returns icon JSX element
   */
  function chooseIcon() {
    if (props.clouds != undefined && props.type != undefined) {
      if (props.type != 'Rain') {
        if (props.clouds >= 60) {
          return (
            <CloudyIcon 
              style={styles.forecastIcon} 
              fill={colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]} 
            />
          )
        }
        else {
          return (
            <LightCloudIcon 
              style={styles.forecastIcon} 
              fill={colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]} 
            />
          )
        }
      }
      else {
        if (props.description.includes('light')) {
          return (
            <LightRainIcon 
              style={styles.forecastIcon} 
              fill={colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]} 
            />
          )
        }
        else {
          return (
            <HeavyRainIcon 
              style={styles.forecastIcon} 
              fill={colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]}             
            />
          )
        }
      }     
    }
    else {
      <LightCloudIcon 
        style={styles.forecastIcon} 
        fill={colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]} 
      />
    }
  }

  // ToDo: add more icons (probably make a module to handle this)
  return (
    <View style={[styles.forecastContainer,
      colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
    ]}>
      <Text style={
          colorScheme == 'dark' ? styles.forecastLargeLabelDark : styles.forecastLargeLabelLight
        }>
          {Math.round(Number(props.temp) * 10)/10}°C
      </Text>
      {chooseIcon()}
      <Text style={
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight
        }>
          {capitalizeFirstWord(props.description ? props.description : 'undefined')}
      </Text>
      <Text style={
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight
        }>
          Clouds: {props.clouds}%
      </Text>
      <Text style={
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight
        }>
          Rain: {props.rainProbability}%
      </Text>
      <Text style={
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight
        }>
          Wind: {props.windSpeed}m/s
      </Text>
      <Text style={[
          colorScheme == 'dark' ? styles.forecastLargeLabelDark : styles.forecastLargeLabelLight,
          {marginTop: 8}
        ]}>
          {props.time}
      </Text>
    </View>
  )
}