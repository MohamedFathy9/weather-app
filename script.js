let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("SearchBtn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "8002c6ef3159330ffbab0c306126fc2a",
  currentWeatherCard = document.querySelectorAll(".weather-left .card")[0],
  fiveDaysForecastCard = document.querySelector(".day-forecast"),
  aqiCard = document.querySelectorAll(".highlights .card")[0],
  sunriseCard = document.querySelectorAll(".highlights .card")[1],
  humidityVal = document.getElementById("humidityVal"),
  pressureVal = document.getElementById("pressureVal"),
  visibilityVal = document.getElementById("visibilityVal"),
  windspeedVal = document.getElementById("windspeedVal"),
  feelsVal = document.getElementById("feelsVal"),
  hourlyForecastCard = document.querySelector(".hourly-forecast"),
  aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const fetchData = (url) => {
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred while fetching weather data.");
    });
};

function getWeatherDetails(name, lat, lon, country, state) {
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  fetchData(AIR_POLLUTION_API_URL).then((data) => {
    let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
    aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${
      aqiList[data.list[0].main.aqi - 1]
    }</p>
            </div>
            <div class="air-indices">
                <i class="fa-solid fa-wind fa-3x"></i>
                ${generateAirQualityItems({
                  pm2_5,
                  pm10,
                  so2,
                  co,
                  no,
                  no2,
                  nh3,
                  o3,
                })}
            </div>
        `;
  });

  fetchData(WEATHER_API_URL).then((data) => {
    let date = new Date();
    currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;c</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${
                      data.weather[0].icon
                    }@2x.png" alt="" />
                </div>
            </div>
            <hr />
            <div class="card-footer">
                <p><i class="fa-solid fa-calendar"></i> ${
                  days[date.getDay()]
                }, ${date.getDate()} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;

    let { sunrise, sunset } = data.sys;
    let { timezone, visibility } = data;
    let { humidity, pressure, feels_like } = data.main;
    let { speed } = data.wind;

    let sRiseTime = moment
      .unix(sunrise)
      .utc()
      .add(timezone, "seconds")
      .format("hh:mm A");
    let sSetTime = moment
      .unix(sunset)
      .utc()
      .add(timezone, "seconds")
      .format("hh:mm A");

    sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-solid fa-sun" style="font-size: 4em; color: gold"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-solid fa-cloud-sun" style="font-size: 4em; color: orange"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `;

    humidityVal.innerHTML = `${humidity}%`;
    pressureVal.innerHTML = `${pressure} hPa`;
    visibilityVal.innerHTML = `${visibility / 1000} km`;
    windspeedVal.innerHTML = `${speed} m/s`;
    feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;c`;
  });

  fetchData(FORECAST_API_URL).then((data) => {
    let hourlyForecast = data.list;
    updateHourlyForecast(hourlyForecast);
    updateFiveDaysForecast(data.list, days, months);
  });
}

function generateAirQualityItems(data) {
  return Object.keys(data)
    .map((key) => {
      return `
            <div class="item">
                <p>${key.toUpperCase()}</p>
                <h2>${data[key]}</h2>
            </div>
        `;
    })
    .join("");
}

function updateHourlyForecast(hourlyForecast) {
  hourlyForecastCard.innerHTML = "";
  for (let i = 0; i <= 7; i++) {
    let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
    let hr = hrForecastDate.getHours();
    let period = hr < 12 ? "AM" : "PM";
    if (hr == 0) hr = 12;
    if (hr > 12) hr -= 12;
    hourlyForecastCard.innerHTML += `
            <div class="card">
                <p>${hr} ${period}</p>
                <img src="https://openweathermap.org/img/wn/${
                  hourlyForecast[i].weather[0].icon
                }.png" alt="" />
                <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(
                  2
                )}&deg;c</p>
            </div>
        `;
  }
}

function updateFiveDaysForecast(forecastData, days, months) {
  let uniqueForecastDays = [];
  let fiveDaysForecast = forecastData.filter((forecast) => {
    let forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      uniqueForecastDays.push(forecastDate);
      return true;
    }
    return false;
  });

  fiveDaysForecastCard.innerHTML = "";
  for (let i = 1; i < fiveDaysForecast.length; i++) {
    let date = new Date(fiveDaysForecast[i].dt_txt);
    fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item">
                <div class="icon-wrapper">
                    <img src="https://openweathermap.org/img/wn/${
                      fiveDaysForecast[i].weather[0].icon
                    }.png" alt="" />
                    <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(
                      2
                    )}&deg;c</span>
                </div>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <p>${days[date.getDay()]}</p>
            </div>
        `;
  }
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
  fetchData(GEOCODING_API_URL).then((data) => {
    let { name, lat, lon, country, state } = data[0];
    getWeatherDetails(name, lat, lon, country, state);
  });
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
      fetchData(REVERSE_GEOCODING_URL).then((data) => {
        let { name, country, state } = data[0];
        getWeatherDetails(name, latitude, longitude, country, state);
      });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation permission denied. Please enable location services to grant access."
        );
      }
    }
  );
}

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
window.addEventListener("load", getUserCoordinates);
