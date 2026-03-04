const form = document.querySelector(".search-form");
const cityInput = document.querySelector(".city-input");

const cityElement = document.querySelector(".city");
const dateElement = document.querySelector(".date");
const tempElement = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");
const themeToggle = document.getElementById("theme-toggle");

async function fetchWeather(city) {
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      alert("City not found");
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,visibility,windspeed_10m`
    );

    const weatherData = await weatherResponse.json();

    updateWeatherUI(name, weatherData.current);
  } catch (error) {
    alert("Something went wrong!");
    console.error(error);
  }
}

function updateWeatherUI(cityName, data) {
  cityElement.textContent = cityName;

  const today = new Date();
  dateElement.textContent = today.toDateString();

  tempElement.textContent = `${Math.round(data.temperature_2m)}°C`;
  windSpeed.textContent = `${data.windspeed_10m} km/h`;
  humidity.textContent = `${data.relative_humidity_2m}%`;
  visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city === "") return;
  fetchWeather(city);
  cityInput.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Delhi");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀ Light";
  } else {
    themeToggle.textContent = "🌙 Dark";
  }
});
