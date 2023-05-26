//#region Imports
import { View, Text, useColorScheme, Linking } from 'react-native';
import {   
  MD3DarkTheme, 
  MD3LightTheme,
  adaptNavigationTheme,
  Button,
  Provider as PaperProvider 
} from 'react-native-paper';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { styles } from '../modules/styles';
import theme from '../modules/theme';
import { version as appVersion } from '../package.json';
import { owner, repoName } from '../modules/consts';
import { useEffect, useState } from 'react';

//#endregion

export default function InfoScreen() {
  const colorScheme = useColorScheme(); // gets system theme mode
  const [latestVersion, setLatestVersion] = useState('');

  useEffect(() => {
    getLatestVersion();
  }, []);

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
  
  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <View style={[
          styles.container,
          {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[95]}
        ]}>
          <View style={{
              paddingHorizontal: 40,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 26,
              elevation: 5,
              backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90]
            }}>
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
                {latestVersion != `v.${appVersion}` ? 
                  `Update to ${latestVersion} available:` : 
                  'You are using the latest version'
                }
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