//#region Imports
import React from 'react';
import { View, Text, useColorScheme, Linking } from 'react-native';
import {
  Button,
  Provider as PaperProvider 
} from 'react-native-paper';
import { styles } from '../modules/styles';
import { theme, CombinedDarkTheme, CombinedDefaultTheme } from '../modules/theme';
import { version as appVersion } from '../package.json';
import { owner, repoName } from '../modules/consts';
import {checkInternetConnection} from '../modules/WeatherApiHandler';
import { useEffect, useState } from 'react';

//#endregion

export default function InfoScreen() {
  //#region consts and functions
  const colorScheme = useColorScheme(); // gets system theme mode
  const [isInternetConnected, setIsInternetConnected] = React.useState<boolean | null>(false);
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    checkConnection();
    getLatestVersion();
  }, []);

  async function checkConnection() {
    const isConnected = await checkInternetConnection();
    setIsInternetConnected(isConnected);
  };

  function checkUpdateStatus() {
    if (isInternetConnected) {
      if (latestVersion != `v.${appVersion}`) {
        return `Update to ${latestVersion} available:`;
      }
      else {
        return 'You are using the latest version';
      }
    }
    else {
      return 'Unable to check for updates';
    }
  }

  async function getLatestVersion() {
    const link = `https://api.github.com/repos/${owner}/${repoName}/releases/latest`;

    try {
      const response = await fetch(link);
      const data = await response.json();

      if (response.ok) {
        setLatestVersion(data?.tag_name);
      }
      else {
        console.log('There was an error getting response from GitHub API');
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  //#endregion
  
  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <View style={[
          styles.container,
          {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[95]}
        ]}>
          <View style={[
              styles.appInfoBox,
              {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90]}
            ]}>
            <Text style={colorScheme == 'dark' ? styles.darkText : styles.text}>
              App version: {appVersion}
            </Text>
            <Text style={[
                colorScheme == 'dark' ? styles.darkText : styles.text, 
                {marginTop: 0, marginBottom: 20}
              ]}
              onPress={() => Linking.openURL(`https://github.com/${owner}`)}>
              Author: {owner}
            </Text>
            <Button 
              style={{marginBottom: 20}}
              buttonColor={colorScheme == 'dark' ? theme.palettes.primary[40] : theme.palettes.primary[90]}
              mode='contained-tonal' 
              onPress={() => Linking.openURL(`https://github.com/${owner}/${repoName}`)}>
              See app page on GitHub
            </Button>
            <Text style={[
                colorScheme == 'dark' ? styles.darkText : styles.text, 
                {marginTop: 0, marginBottom: 20}
              ]}>
                {checkUpdateStatus()}
            </Text>
            {latestVersion != `v.${appVersion}` ? (
              <Button 
                style={{marginBottom: 20}}
                buttonColor={colorScheme == 'dark' ? theme.palettes.primary[40] : theme.palettes.primary[90]}
                mode='contained-tonal' 
                onPress={() => Linking.openURL(`https://github.com/${owner}/${repoName}/releases/latest`)}>
                Update app
              </Button>
            ) : (null)}
            
            <Button 
              onPress={() => Linking.openURL(`https://github.com/${owner}/${repoName}/blob/81dc418110ee80cbd69d61c900fc8440e8fc8497/LICENSE`)}>
              MIT license
            </Button>
          </View>
      </View>
    </PaperProvider>
  )
}