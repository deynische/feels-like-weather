# Feels Like Weather
A simple page showing the current ambient weather using [Dark Sky API](https://darksky.net/dev) and [OpenCage Geocoding API](https://opencagedata.com/).

This project is based on the [freeCodeCamp local weather project](https://learn.freecodecamp.org/coding-interview-prep/take-home-projects/show-the-local-weather/).

Images from Unsplash and Pixabay.

## Notice
As it is best practice to obfuscate API keys, this project will not work client-side without my API keys. Current thoughts are to either implement CodePen's solution of prompting the user for an API key or to refactor the project to use the [freeCodeCamp Weather API](https://fcc-weather-api.glitch.me/).

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