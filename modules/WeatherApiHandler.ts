import { apiKey, locationNumLimit, timestamps } from "./consts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

let units = 'metric';
let lang = 'en';
let numberOfTimestamps = '7';

export type currentWeather = {
  type: string;
  description: string;
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  isMetric: boolean;
  rainProbability?: number;
  seaPressure: number;
  groundPressure?: number;
  visibility?: number;
  windSpeed: number;
  windDirection?: number;
  clouds?: number;
  code?: number; // optional
  icon?: string;
  errorCode?: number;
  sunrise?: string;
  sunset?: string;
  timezone?: string;
}

export type forecast = {
  timestamps?: string;
  isMetric: boolean;
  list: {
    time: (string | number)[];
    date: string[];
    temp: number[];
    description?: string[];
    type: string[];
    clouds?: number[];
    windSpeed?: number[];
    rainProbability?: number[];
  }
};

export type location = {
  city?: string | undefined;
  lat: number | undefined;
  lon: number | undefined;
}

export type settings = {
  units: string;
  lang: string;
  numberOfTimestamps: string;
}

/**
 * Converts timestamp to a 24h formatted time.
 * @param timestamp usually a 10-digit number.
 */
export function convertTime(timestamp : number) {
  const date = new Date(timestamp * 1000);
  const time = date.toTimeString();

  return convertTimeFormat(time);
}

function convertTimeFormat(timeString : string) {
  const [time, offset] = timeString.split(' GMT');
  const formattedTime = time.substring(0, 5);
  //const formattedOffset = offset.replace(/(\d{2})(\d{2})/, '$1:$2');

  return `${formattedTime}`;
}

export function convertDate(timestamp : number) {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
  }).replace(/\//g, "."); // replacing '/' to '.'

  return formattedDate;
}

/**
 * Converts timestamp to timezone
 * @returns formatted time string (e.g. +3:00)
 */
function convertTimezone(timezone : number) {
  const hours = Math.floor(Math.abs(timezone) / 3600);
  const minutes = Math.floor((Math.abs(timezone) % 3600) / 60);
  const sign = timezone >= 0 ? '+' : '-';

  return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * A function to check internet connection
 * @returns true if there is an Internet connection.
 */
export const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

/**
 * Capitalizes only the first word in a sequence.
 * @returns capitalized words
 */
export const capitalizeFirstWord = (words : string) => {
  const wordArray = words.split(' ');
  if (wordArray.length > 0) {
    wordArray[0] = wordArray[0].charAt(0).toUpperCase() + wordArray[0].slice(1);
  }
  return wordArray.join(' ');
};

/**
 * Gets location from user's IP.
 * @returns current location object with coordinates.
 */
const getLocationByIP = async () => {
  try {
    const response = await fetch(
      `http://ip-api.com/json/`
    );
    const data = await response.json();

    const currentLocationData: location = {
      lat: data.lat,
      lon: data.lon,
    }

    const cityNameResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${currentLocationData?.lat}&lon=${currentLocationData?.lon}&limit=${locationNumLimit}&appid=${apiKey}`
    )
    const cityData = await cityNameResponse.json();

    currentLocationData.city = cityData[0].name;

    return currentLocationData;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Turns city name into coordinates.
 * @param location city name.
 * @returns current location object with coordinates.
 */
export const getLocation = async (location: string) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${locationNumLimit}&appid=${apiKey}`
    );
    const data = await response.json();

    const currentLocationData: location = {
      city: data[locationNumLimit - 1]?.name,
      lat: data[locationNumLimit - 1]?.lat,
      lon: data[locationNumLimit - 1]?.lon,
    }

    return currentLocationData;
  }
  catch (error) {
    console.log("getLocation error" + error);
    return null;
  }
}

//#region Current weather

/**
* Gets current weather. If the parameter isn't used, gets location by IP.
* @returns currentWeather object.
*/
export const getWeather = async (location: string = '') => {
  const newLocation = location ? await getLocation(location) : await getLocationByIP();

  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&lat=${newLocation?.lat}&lon=${newLocation?.lon}&lang=${lang}&units=${units}`
    );
    console.log(`http://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&lat=${newLocation?.lat}&lon=${newLocation?.lon}&lang=${lang}&units=${units}`);

    const data = await response.json();

    const currentWeatherData: currentWeather = {
      type: data.weather[0]?.main,
      description: data.weather[0]?.description,
      city: newLocation?.city ?? 'Unknown',
      temp: data?.main.temp,
      feelsLike: data?.main.feels_like,
      humidity: data?.main.humidity,
      isMetric: units == 'metric' ? true : false,
      seaPressure: data?.main.pressure,
      groundPressure: data?.main.grnd_level,
      visibility: data?.visibility,
      windSpeed: data?.wind.speed,
      windDirection: data?.wind.deg,
      clouds: data?.clouds.all,
      code: data.weather[0]?.id,
      icon: data.weather[0]?.icon,
      errorCode: data?.cod,
      sunrise: convertTime(data?.sys?.sunrise),
      sunset: convertTime(data?.sys?.sunset),
      timezone: convertTimezone(data?.timezone),
    };

    console.log(currentWeatherData);

    return currentWeatherData;
  }
  catch (error) {
    console.log("getWeather error:\n" + error);
    return null;
  }
};

/**
 * Gets and sets weather data for specified city.
 * @param location - city name. If not specified or empty - gets weather for current IP
 */
export const getWeatherData = async (location : string = '') => {
  try {
    const data = await getWeather(location);
    // saving the data locally if it's not undefined:
    if (data) {
      await AsyncStorage.setItem(`currentWeatherData/${data?.city}`, JSON.stringify(data));
    }
    return data;
  }
  catch (error) {
    console.log("Error in getWeatherData(): \n" + error);
    return null;
  }
};

//#endregion

//#region Forecast

/**
 * Gets forecast data from API.
 * @param city city name
 * @param numberOfTimestamps number of timestamps that will be returned
 * @returns forecast data object of type forecast
 */
export async function getForecast(city: string) {
  const newLocation = city ? await getLocation(city) : await getLocationByIP();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${newLocation?.lat}&lon=${newLocation?.lon}&cnt=${numberOfTimestamps}&appid=${apiKey}&units=${units}&lang=${lang}`
    );

    console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${newLocation?.lat}&lon=${newLocation?.lon}&cnt=${numberOfTimestamps}&appid=${apiKey}&units=${units}&lang=${lang}`);
    const data = await response.json();

    const forecastData : forecast = {
      timestamps: data?.cnt,
      isMetric: units == 'metric' ? true : false,
      list: {
        time: [],
        date: [],
        temp: [],
        description: [],
        type: [],
        clouds: [],
        rainProbability: [],
        windSpeed: [],
      },
    };

    data?.list.slice(0, data?.cnt).forEach((item: any) => {
      forecastData.list?.time.push(convertTime(item?.dt));
      forecastData.list?.date.push(convertDate(item?.dt));
      forecastData.list?.temp.push(item?.main.temp);
      forecastData.list?.description?.push(item?.weather[0].description);
      forecastData.list?.type?.push(item?.weather[0]?.main);
      forecastData.list?.clouds?.push(item.clouds.all);
      forecastData.list?.rainProbability?.push(Math.round(item.pop*100));
      forecastData.list?.windSpeed?.push(item.wind.speed);
    });

    // saving the data locally if it's not undefined:
    if (forecastData) {
      await AsyncStorage.setItem(`forecastData/${newLocation?.city}`, JSON.stringify(forecastData));
    }

    return forecastData;
  } 
  catch (error) {
    console.log(error);
    return null;
  }
}

export async function saveSettings(props: settings) {
  try {
    props.lang = props.lang ?? 'en';
    props.units = props.units ?? 'metric';
    props.numberOfTimestamps = props.numberOfTimestamps ?? 7;

    await AsyncStorage.setItem(`settings`, JSON.stringify(props));
    units = props.units ?? 'metric';
    lang = props.lang ?? 'en';
    numberOfTimestamps = props.numberOfTimestamps ?? '7';
  }
  catch (error) {
    console.log(error);
  }
}

export async function loadSettings() {
  try {
    const settings = await AsyncStorage.getItem(`settings`);
    
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        
        units = parsedSettings.units ?? 'metric';
        lang = parsedSettings.lang ?? 'en';
        numberOfTimestamps = parsedSettings.numberOfTimestamps ?? '7';

        return parsedSettings;
      }
      catch (error) {
        console.log('Invalid settings format:', settings);
        return getDefaultSettings();
      }
    }
    else {
      const defaultSettings = getDefaultSettings();
      saveSettings(defaultSettings);

      return defaultSettings;
    }
  }
  catch (error) {
    console.log(error);
    const defaultSettings = getDefaultSettings();
    saveSettings(defaultSettings);

    return defaultSettings;
  }
}

function getDefaultSettings(): settings {
  return {
    units: 'metric',
    lang: 'en',
    numberOfTimestamps: '7',
  };
}

export async function deleteSettings() {
  try {
    const settings = await AsyncStorage.removeItem(`settings`);
    console.log(settings);
  }
  catch (error) {
    console.log(error);
  }
}

//#endregion