//#region Imports
import { View, Text, useColorScheme } from 'react-native';
import { styles }from './styles';
import { theme } from './theme';
import { measuringUnits } from './consts';
import { capitalizeFirstWord } from './WeatherApiHandler';
import CloudyIcon from '../assets/weather-icons/wi-cloudy.svg';
import LightCloudIcon from '../assets/weather-icons/wi-day-cloudy.svg';
import LightRainIcon from '../assets/weather-icons/wi-rain-mix.svg';
import HeavyRainIcon from '../assets/weather-icons/wi-rain.svg';
import ClearIcon from '../assets/weather-icons/wi-day-sunny.svg';
import LightningIcon from '../assets/weather-icons/wi-day-lightning.svg';
import ThunderstormIcon from '../assets/weather-icons/wi-day-thunderstorm.svg';
import DrizzleIcon from '../assets/weather-icons/wi-showers.svg';
import SnowIcon from '../assets/weather-icons/wi-snow.svg';
import FogIcon from '../assets/weather-icons/wi-fog.svg';

//#endregion

type forecastProps = {
  key: string | number;
  temp: number | string;
  time: number | string;
  date: string;
  description: string;
  type: string;
  id: number;
  isMetric: boolean;
  clouds: number,
  rainProbability?: number,
  windSpeed?: number,
}

export default function ForecastWidget(props: forecastProps) {
  //#region functions
  const colorScheme = useColorScheme(); // gets system theme mode

  /**
   * Chooses which weather icon to render
   * @returns icon JSX element
   */
  function chooseIcon() { // TODO: add more icons and probably change the algorithm (for better code looks)
    let color = colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98];

    if (props.id != undefined) {
      // Thunderstorm
      if (props.id >= 200 && props.id <= 232)
      {
        if (props.id == 211) {
          return (
            <LightningIcon
              style={styles.forecastIcon} 
              fill={color}
            />
          )
        }
        else {
          return (
            <ThunderstormIcon
              style={styles.forecastIcon} 
              fill={color}
            />
          )
        }
      }
      // Drizzle
      else if (props.id >= 300 && props.id <= 321)
      {
        return (
          <DrizzleIcon
            style={styles.forecastIcon} 
            fill={color}
          />
        )
      }
      // Rain
      else if (props.id >= 500 && props.id <= 531) 
      {
        if (props.id == (500 || 520)) {
          return (
            <LightRainIcon 
              style={styles.forecastIcon} 
              fill={color} 
            />
          )
        }
        else {
          return (
            <HeavyRainIcon 
              style={styles.forecastIcon} 
              fill={color}             
            />
          )
        }
      }
      // Snow
      else if (props.id >= 600 && props.id <= 622)
      {
        return (
          <SnowIcon
            style={styles.forecastIcon} 
            fill={color}
          />
        )
      }
      // Fog
      else if (props.id >= 701 && props.id <= 781)
      {
        return (
          <FogIcon 
            style={styles.forecastIcon} 
            fill={color}
          />
        )
      }
      // Clear sky
      else if (props.id == 800) 
      {
        return (
          <ClearIcon 
            style={styles.forecastIcon} 
              fill={color}
          />
        )
      }
      // Clouds
      else if (props.id >= 801 && props.id <= 804) 
      {
        if (props.clouds >= 51) {
          return (
            <CloudyIcon 
              style={styles.forecastIcon} 
              fill={color}
            />
          )
        }
        else {
          return (
            <LightCloudIcon 
              style={styles.forecastIcon} 
              fill={color} 
            />
          )
        }
      }
      // default icon
      else 
      {
        return (
          <LightCloudIcon 
            style={styles.forecastIcon}
            fill={color}
          />
        )
      }
    }
    else {
      return (
        <LightCloudIcon 
          style={styles.forecastIcon} 
          fill={color} 
        />
      )
    }
  }
  //#endregion

  // ToDo: add more icons (probably make a module to handle this)
  return (
    <View style={[styles.forecastContainer,
      colorScheme == 'dark' ? styles.detailsBoxDark : styles.detailsBoxLight,
    ]}>
      <Text style={
          colorScheme == 'dark' ? styles.forecastLargeLabelDark : styles.forecastLargeLabelLight
        }>
          {Math.round(Number(props.temp) * 10)/10}{props.isMetric ? measuringUnits.metric.temp : measuringUnits.imperial.temp}
      </Text>
      {chooseIcon()}
      <Text style={[
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight,
          {marginBottom: 3}
        ]}>
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
          Wind: {props.windSpeed} {props.isMetric ? measuringUnits.metric.speed : measuringUnits.imperial.speed}
      </Text>
      <Text style={[
          colorScheme == 'dark' ? styles.forecastLargeLabelDark : styles.forecastLargeLabelLight,
          {marginTop: 8}
        ]}>
          {props.time}
      </Text>
      <Text style={[
          {marginTop: 2},
          colorScheme == 'dark' ? styles.forecastMeduimLabelDark : styles.forecastMeduimLabelLight
        ]}>
          {props.date}
      </Text>
    </View>
  )
}