import { StyleSheet } from 'react-native';
import {theme} from './theme';

export function hexToRgba(hex : string, opacity : number) {
  hex = hex.replace('#','');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);

  const result = 'rgba('+r+','+g+','+b+','+opacity+')';
  return result;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    fontFamily: 'Roboto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWeatherContainer: {
    fontFamily: 'Roboto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    borderRadius: 16,
    paddingVertical: 4,
    margin: 25,
  },
  temperatureContainerDark: {
    //backgroundColor: theme.extendedColors.dark.secondaryDarker
  },
  temperatureContainerLight: {
    //backgroundColor: theme.extendedColors.light.secondaryLighter
  },
  temperature: {
    fontWeight: '600',
    fontFamily: 'Roboto',
    fontSize: 55,
    textShadowOffset: { width: -1, height: 2 }, // Shadow offset (horizontal, vertical)
    textShadowRadius: 10, // Shadow blur radius
    paddingLeft: 12,
  },
  temperatureDark: {
    color: theme.palettes.secondary[90],
  },
  temperatureLight: {
    color: theme.palettes.secondary[95],
  },
  description: {
    paddingHorizontal: 25,
    borderRadius: 16,
    paddingVertical: 14,
    fontFamily: 'Roboto',
    fontSize: 16,
    margin: 20,
  },
  descriptionDark: {
    backgroundColor: theme.extendedColors.dark.secondaryDarker,
    color: theme.schemes.dark.secondary,
  },
  descriptionLight: {
    backgroundColor: theme.extendedColors.light.secondaryLighter,
    color: theme.schemes.light.onSecondary,
  },
  feelsLike: {
    fontSize: 15,
  },
  feelsLikeDark: {
    color: theme.schemes.dark.secondary
  },
  feelsLikeLight: {
    color: theme.schemes.light.secondary
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
  },
  detailsBox: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 8,
    padding: 18,
    borderRadius: 16,
  },
  detailsBoxDark: {
    backgroundColor: theme.extendedColors.dark.secondaryLighter,
  },
  detailsBoxLight: {
    backgroundColor: theme.extendedColors.light.secondaryDarker,
  },
  detailsTextDark: {
    color: theme.palettes.secondary[10],
  },
  detailsTextLight: {
    color: theme.palettes.secondary[98],
  },
  // Add Weather screen:
  textInput: {
    minWidth: '90%',
    fontFamily: 'Roboto',
    margin: 10,
    marginTop: 0,
  },
  text: {
    margin: 20,
    color: theme.palettes.secondary[10],
  },
  darkText: {
    margin: 20,
    color: theme.palettes.secondary[98],
  },
  errorText: {
    margin: 20,
    color: theme.palettes.error[60],
  },
  successText: {
    margin: 20,
    color: 'green',
  },

  // Forecast widget
  forecastContainer: {
    flex: 1,
    fontFamily: 'Roboto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    width: 130,
  },
  forecastLargeLabelDark: {
    fontSize: 18,
    color: theme.palettes.secondary[10],
  },
  forecastLargeLabelLight: {
    fontSize: 18,
    color: theme.palettes.secondary[98],
  },
  forecastMeduimLabelDark: {
    fontSize: 14,
    color: theme.palettes.secondary[10],
  },
  forecastMeduimLabelLight: {
    fontSize: 14,
    color: theme.palettes.secondary[98],
  },
  forecastIcon: {
    width: 60,
    height: 60,
  },

  appInfoLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appInfoBox: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    elevation: 5,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center',
    top: 0,
    marginBottom: 150,
    marginTop: 25,
    paddingHorizontal: 12,
  },
  settingsBox: {
    padding: 16, 
    borderRadius: 16, 
    margin: 8,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  labelMediumLight: {
    fontSize: 15,
    color: theme.palettes.secondary[98],
  },
  labelMediumDark: {
    fontSize: 15,
    color: theme.palettes.secondary[10],
  },
  labelNormalLight: {
    fontSize: 14,
    color: theme.palettes.secondary[98],
  },
  labelNormalDark: {
    fontSize: 14,
    color: theme.palettes.secondary[10],
  },
  labelLargeLight: {
    fontSize: 18,
    color: theme.palettes.secondary[98],
  },
  labelLargeDark: {
    fontSize: 18,
    color: theme.palettes.secondary[10],
  },
  settingsScroll: {
    paddingBottom: 40,
    marginBottom: 40,
  }
});

export { styles };