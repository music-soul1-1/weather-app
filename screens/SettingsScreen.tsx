//#region Imports
import React from 'react';
import { View, Text, useColorScheme, ScrollView } from 'react-native';
import {   
  Button,
  Provider as PaperProvider 
} from 'react-native-paper';
import { styles } from '../modules/styles';
import { theme, CombinedDarkTheme, CombinedDefaultTheme } from '../modules/theme';
import { version as appVersion } from '../package.json';
import { langs, units, timestamps } from '../modules/consts';
import {loadSettings, saveSettings, deleteSettings, settings} from '../modules/WeatherApiHandler';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
//#endregion


export default function SettingsScreen({navigation}: {navigation: any}) {
  const colorScheme = useColorScheme(); // gets system theme mode
  const [isDropdownOpen, setDropdownOpen] = useState([false, false]);
  const [dropValues, setDropValues] = useState<settings>({
    units: 'metric', 
    lang: 'en', 
    numberOfTimestamps: '7',
  });

  const [unitItems] = useState(units);
  const [langItems] = useState(langs);
  const [timestampsItems] = useState(timestamps);

  useEffect(() => {
      loadData();
  }, []);

  useEffect(() => {
    const data : settings = {
      units: dropValues.units?? 'metric',
      lang: dropValues.lang?? 'en',
      numberOfTimestamps: dropValues.numberOfTimestamps?? '7',
    }
    saveSettings(data);
  }, [dropValues]);

  async function loadData() {
    try {
      const data : settings = await loadSettings();
      setDropValues(data);
    }
    catch(error) {
      console.log(error);
    }
  }

  return (
    <PaperProvider theme={colorScheme == 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <View style={[
          styles.container,
          {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[10] : theme.palettes.secondary[95],
          paddingTop: 15}
        ]}>
        <ScrollView style={styles.settingsScroll}>
          <View style={[
              styles.settingsBox,
              {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90], 
              minWidth: 320}
            ]}>
              <Text style={
                colorScheme == 'dark' ? styles.labelMediumLight : styles.labelMediumDark
              }>
                Measurement units:
              </Text>
              <Dropdown
                labelField="label"
                valueField="value"
                activeColor={colorScheme == 'dark' ? theme.palettes.secondary[60] : theme.palettes.secondary[90]}
                placeholder={dropValues.units}
                backgroundColor='rgba(0,0,0,0.5)' // on select color
                style={{width: 120}}
                itemContainerStyle={{
                  backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[70]
                }}
                itemTextStyle={{
                  color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
                }}
                selectedTextStyle={{
                  color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
                }}
                containerStyle={{backgroundColor: theme.palettes.secondary[30]}}
                value={dropValues.units}
                data={unitItems}
                onFocus={() => setDropdownOpen([true, false])}
                onBlur={() => setDropdownOpen([false, false])}
                onChange={item => {
                  setDropValues({
                    units: item.value, 
                    lang: dropValues.lang, 
                    numberOfTimestamps: dropValues.numberOfTimestamps
                  });
                  setDropdownOpen([false, false]);
                }}
              />
          </View>
          <View style={[
              styles.settingsBox,
              {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90]}
            ]}>
            <Text style={
                colorScheme == 'dark' ? styles.labelMediumLight : styles.labelMediumDark
              }>
              Language:
            </Text>
            <Dropdown
              labelField="label"
              valueField="value"
              placeholder={dropValues.lang}
              search
              activeColor={colorScheme == 'dark' ? theme.palettes.secondary[60] : theme.palettes.secondary[90]}
              backgroundColor='rgba(0,0,0,0.5)' // on select color
              searchPlaceholder='Search'
              inputSearchStyle={{
                color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[30],
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[20] : theme.palettes.secondary[98]
              }}
              style={{width: 120}}
              itemContainerStyle={{
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[70]
              }}
              itemTextStyle={{
                color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
              }}
              selectedTextStyle={{
                color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
              }}
              containerStyle={{
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[70]
              }}
              value={dropValues.lang}
              data={langItems}
              onFocus={() => setDropdownOpen([false, true])}
              onBlur={() => setDropdownOpen([false, false])}
              showsVerticalScrollIndicator={true}
              onChange={item => {
                setDropValues({
                  units: dropValues.units, 
                  lang: item.value, 
                  numberOfTimestamps: dropValues.numberOfTimestamps
                });
                setDropdownOpen([false, false]);
              }}
              mode='modal' // enables scrolling
            />
          </View>
          <View style={[
              styles.settingsBox,
              {backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[90]}
            ]}>
            <Text style={
                colorScheme == 'dark' ? styles.labelMediumLight : styles.labelMediumDark
              }>
              Forecast timestamps:
            </Text>
            <Dropdown
              labelField="label"
              valueField="value"
              placeholder={dropValues.numberOfTimestamps?.toString()}
              activeColor={colorScheme == 'dark' ? theme.palettes.secondary[60] : theme.palettes.secondary[90]}
              backgroundColor='rgba(0,0,0,0.5)' // on select color
              style={{width: 120}}
              itemContainerStyle={{
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[70]
              }}
              itemTextStyle={{
                color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
              }}
              selectedTextStyle={{
                color: colorScheme == 'dark' ? theme.palettes.secondary[98] : theme.palettes.secondary[20]
              }}
              containerStyle={{
                backgroundColor: colorScheme == 'dark' ? theme.palettes.secondary[30] : theme.palettes.secondary[70]
              }}
              value={dropValues.numberOfTimestamps?.toString()}
              data={timestampsItems}
              onFocus={() => setDropdownOpen([false, true])}
              onBlur={() => setDropdownOpen([false, false])}
              showsVerticalScrollIndicator={true}
              onChange={item => {
                setDropValues({
                  units: dropValues.units, 
                  lang: dropValues.lang, 
                  numberOfTimestamps: item.value
                });
                setDropdownOpen([false, false]);
              }}
              mode='modal' // enables scrolling
            />
          </View>
          <View style={{alignItems: 'center', marginTop: 250}}>
            <Button onPress={() => deleteSettings()}>
              Reset settings
            </Button>
            <Text 
              style={[
                colorScheme == 'dark' ? styles.labelNormalLight : styles.labelNormalDark,
                {margin: 20, marginBottom: 5}
              ]}>
                Click to see app info:
            </Text>
            <Button 
              style={{marginBottom: 25}}
              onPress={() => navigation.navigate('InfoScreen')}>
              v.{appVersion}
            </Button>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  )
}