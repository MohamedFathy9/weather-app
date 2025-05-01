# 🌤️ Weather App

A modern, responsive weather web application built using **HTML**, **CSS**, and **JavaScript**, powered by the [OpenWeatherMap API](https://openweathermap.org/api). This app displays current weather, air quality index (AQI), sunrise/sunset times, hourly forecasts, and a 5-day forecast based on user input or geolocation.

## 🔍 Features

- 🔎 Search weather by city name
- 📍 Detect weather using your current location
- ☀️ Current temperature with weather conditions
- 🌅 Sunrise & Sunset times
- 🏞️ Air Quality Index (AQI) with breakdown (PM2.5, PM10, CO, NO, etc.)
- 📆 Hourly forecast (next 8 hours)
- 📊 5-Day weather forecast
- 💨 Real-time data using OpenWeatherMap APIs



## 🚀 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap APIs
- [Moment.js](https://momentjs.com/) for time formatting
- Font Awesome for icons

## ⚙️ How It Works

- User can enter a city name or allow the browser to access their location.
- The app fetches data from:
  - `weather` API for current conditions
  - `forecast` API for hourly and 5-day forecast
  - `air_pollution` API for AQI details
  - `geo` API for geolocation & reverse lookup

## 🛠️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/MohamedFathy9/weather-app.git

# Navigate into the project directory
cd weather-app

# Open index.html in a browser
