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

//#endregion

export default function InfoScreen() {
  const colorScheme = useColorScheme(); // gets system theme mode

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

  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <View style={[
          styles.container,
          {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[95]}
        ]}>
          <View style={{
              padding: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 26,
              elevation: 5,
              backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90]
            }}>
            <Text style={colorScheme == 'dark' ? styles.darkText : styles.text}>
              App version: v.0.0.1
            </Text>
            <Text style={[
                colorScheme == 'dark' ? styles.darkText : styles.text, 
                {marginTop: 0, marginBottom: 40}
              ]}
              onPress={() => Linking.openURL('https://github.com/music-soul1-1')}>
              Author: music-soul1-1
            </Text>
            <Button 
              style={{marginBottom: 20}}
              buttonColor={colorScheme == 'dark' ? theme.palettes.primary[40] : theme.palettes.primary[90]}
              mode='contained-tonal' 
              onPress={() => Linking.openURL('https://github.com/music-soul1-1/weather-app')}>
              See app page on GitHub
            </Button>
            <Button 
              onPress={() => Linking.openURL('https://github.com/music-soul1-1/weather-app/blob/81dc418110ee80cbd69d61c900fc8440e8fc8497/LICENSE')}>
              MIT license
            </Button>
          </View>
      </View>
    </PaperProvider>
  )
}