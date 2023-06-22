if ("geolocation" in navigator) {
  // Geolocation is supported
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      // Do something with the latitude and longitude values
      console.log("Latitude: " + latitude);
      console.log("Longitude: " + longitude);
      getLocation(latitude, longitude);
    },
    function (error) {
      // Handle error
      console.log("Error getting location: " + error.message);
    }
  );
} else {
  // Geolocation is not supported
  console.log("Geolocation is not supported by this browser.");
}

async function getLocation(latitude, longitude) {
  const url = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${latitude}%2C${longitude}&language=en`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ba59e3bf2emsh3d7932036ffad4bp152774jsn37e1f2517565",
      "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    //console.log(result);
    const location = result.results[0].locality;

    fetchCity(location);
  } catch (error) {
    console.error(error);
  }
}

function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  return `${day} at ${formatHour(timestamp)}`;
}

function formatHour(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeather(response) {
  document.getElementById("city").innerHTML = response.data.name;
  document.getElementById("temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.getElementById("humidity").innerHTML = response.data.main.humidity;
  document.getElementById("wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.getElementById("description").innerHTML =
    response.data.weather[0].main;
  document.getElementById("date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .getElementById("icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
    );
  document
    .getElementById("icon")
    .setAttribute("alt", response.data.weather[0].main);

  celsius = response.data.main.temp;
}

function displayForecast(response) {
  let forecastElement = document.getElementById("forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += ` 
    <div class="col-sm-2 col-xs-12 next-days">
      <div class="card-body border-end-0">
        <p class="hours">${formatHour(forecast.dt * 1000)}</p>
        <img src="https://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }.png" class="icon">
        <p class="min-max">${Math.round(
          forecast.main.temp_max
        )}° | ${Math.round(forecast.main.temp_min)}°</p>
      </div>
    </div>
    `;
  }
}

function fetchCity(city) {
  let metric = `metric`;
  let apiKey = `9aec27109595b5fdde1289ca7baf818f`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${metric}`;
  axios.get(apiUrl).then(displayWeather);

  let apiKeyForecast = `9aec27109595b5fdde1289ca7baf818f`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKeyForecast}&units=${metric}`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function inputCity(event) {
  event.preventDefault();
  let city = document.getElementById("search-input").value;
  fetchCity(city);
}
let form = document.getElementById("search-form");
form.addEventListener("submit", inputCity);

function convertToF(event) {
  event.preventDefault();
  let temperatureElement = document.getElementById("temp");
  Celsius.classList.remove("active");
  Fahrenheit.classList.add("active");
  let fahrenheit = (celsius * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheit);
}

function convertToC(event) {
  event.preventDefault();
  let temperatureElement = document.getElementById("temp");
  Fahrenheit.classList.remove("active");
  Celsius.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsius);
}

let celsius = null;

let unitF = document.getElementById("Fahrenheit");
unitF.addEventListener("click", convertToF);

let unitC = document.getElementById("Celsius");
unitC.addEventListener("click", convertToC);

let t = new Date().getHours();
if (t < 16) {
  document.body.style.backgroundImage = "url('src/media/morning.png')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.getElementById("city-card").style.background =
    "rgba(255, 255, 255, 0.1)";
} else if (t < 20) {
  document.body.style.backgroundImage = "url('src/media/evening.png')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.getElementById("city-card").style.background =
    "rgba(0, 101, 128, 0.1)";
} else {
  document.body.style.backgroundImage = "url('src/media/night.png')";
  document.getElementById("city-card").style.background =
    "rgba(96, 132, 255, 0.1)";
}
