# Feels Like Weather
A simple page showing the current weather using geolocation and API data.

This is based on the [freeCodeCamp local weather project](https://learn.freecodecamp.org/coding-interview-prep/take-home-projects/show-the-local-weather/).

Images from Unsplash and Pixabay.

## A Note On APIs
This project is originally built to use the [Dark Sky API](https://darksky.net/dev) and [OpenCage Geocoding API](https://opencagedata.com/). However, as it is best practice to obfuscate API keys, client-side projects will not work without exposing the keys to potential abuse.

As an alternative, this project checks for the existence of keys and uses the [freeCodeCamp Weather API](https://fcc-weather-api.glitch.me/) in their absence.

One small difference is the Dark Sky version uses apparent temperature while the FCC version uses current temperature.

## To Do
- [x] Set up geolocation
- [x] Set up API call
- [x] Format display data from API response
- [x] Add temperature unit toggle
- [x] Add text input for location search
- [ ] Geocode location for weather API call
- [ ] Format location error display
- [ ] Prettify
  - [x] Layout
  - [x] Typography 
  - [x] Obtain list of all possible weather returns from API
  - [x] Collect list of background images per weather type
  - [x] Use forecast data to set a matching background image
  - [ ] Radio button group
  - [ ] Search input 
- [ ] Refactor to work on GitHub pages
  - [x] Determine which APIs to use
  - [ ] Clean up repetitive code
  - [ ] Fix background image display