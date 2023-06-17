# Weather app

This app allows you to see the current weather and forecast for different cities. 

[OpenWeatherAPI](https://openweathermap.org/) is used to get weather data.

## Features
* Weather app.
* See current weather and forecast for multiple cities.
* Dark and light themes support.
* Background image changes according to system theme and weather.
* Settings.

## Usage

1. Download [the latest release](https://github.com/music-soul1-1/weather-app/releases/latest).
2. Install the .apk.
3. Enjoy :)

If you found any problems that weren't mentioned in [release notes](https://github.com/music-soul1-1/weather-app#release-notes), open an [issue](https://github.com/music-soul1-1/weather-app/issues).

## Screenshots

![1](https://github.com/music-soul1-1/weather-app/assets/72669184/7fce2771-779d-47ee-8eb5-537a5bc1b0ec)

![2](https://github.com/music-soul1-1/weather-app/assets/72669184/d4909f6f-804d-4edc-b543-ece87b5810e0)

![3](https://github.com/music-soul1-1/weather-app/assets/72669184/5753a990-43ed-457f-8eae-7f947d52f166)


## Plans

Here are some planned features and improvements for the Weather App:

- Implement search functionality to allow users to search for specific cities.
- Enhance the UI design for a more visually appealing experience.
- Improve localization.
- Add page indicator.
- Improve code readability.
- Improve performance.
- Add more icons for weather state and wind.
- Change background images.
- Improve error handling and error messages.


## Contributing

If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Run `npm install` to install the required dependencies.
4. Run `npx react-native start` to start Metro.
5. Run `npx react-native run-android` to start the app on an Android device or emulator.
6. Make the necessary changes and commit them.
7. Submit a pull request explaining the changes you've made.

## Release notes

### v.0.0.5
- Fixed icon choosing algorithm.
- More icons added.
- Country code added to header.

### v.0.0.4
- Fixed bug: settings were not loading on app startup.
- Date added to forecast widgets.

### v.0.0.3
- Added settings screen. Now user can change measurement units, language and the number of forecast timestamps.
- Theme declarations where moved to theme module.
- Fixed a bug with update version when device isn't connected to internet.

### v.0.0.2
- Navigation header changed to custom element (in the MainScreen). That means that the bug with buttons and text color is fixed.
- Added version check in app info screen. Now if there's a new release, the user will see a message and an update button.

### v.0.0.1
- First release.
- Please note that there may be some issues. For example, sometimes the header buttons might become inactive. To fix this, just restart the app (this will be fixed in the new releases).

## Dependencies

The following Npm dependencies are used in the app:

- [@react-native-async-storage/async-storage](https://www.npmjs.com/package/@react-native-async-storage/async-storage) (version 1.18.1)
- [@react-native-community/netinfo](https://www.npmjs.com/package/@react-native-community/netinfo) (version 9.3.10)
- [@react-navigation/native](https://www.npmjs.com/package/@react-navigation/native) (version 6.1.6)
- [@react-navigation/native-stack](https://www.npmjs.com/package/@react-navigation/native-stack) (version 6.9.12)
- [react-native-pager-view](https://www.npmjs.com/package/react-native-pager-view) (version 6.2.0)
- [react-native-paper](https://www.npmjs.com/package/react-native-paper) (version 5.8.0)
- [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) (version 4.5.3)
- [react-native-screens](https://www.npmjs.com/package/react-native-screens) (version 3.20.0)
- [react-native-svg](https://www.npmjs.com/package/react-native-svg) (version 13.9.0)
- [react-native-svg-transformer](https://www.npmjs.com/package/react-native-svg-transformer) (version 1.0.0)
- [react-native-element-dropdown](https://www.npmjs.com/package/react-native-element-dropdown) (version 2.9.0)
- and others (see [package.json](package.json))

The app also uses the following:
- [erikflowers's weather-icons](https://github.com/erikflowers/weather-icons)

Note: app uses [React Native CLI](https://reactnative.dev/).

## License

The Weather App is open-source and released under the [MIT License](LICENSE).

## Credits

The Weather App is developed and maintained by [music-soul1-1](https://github.com/music-soul1-1).
