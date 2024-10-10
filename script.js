const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

// Weather info
const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-date-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');

/* forecast item for future days */
const forecastItemsContainer = document.querySelector('.forecast-items-container');

// API
const apiKey = '590853db0b3bc4ab5b352b1fdb7875e8';

/*  */
searchBtn.addEventListener('click', () => {
    let cityName = cityInput.value;
    if (cityName.trim() != '') {
        getCurrentWeatherInfo(cityName);  // Renamed to getCurrentWeatherInfo
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() != '') {
        getCurrentWeatherInfo(cityInput.value);  // Renamed to getCurrentWeatherInfo
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return `thunderstorm.svg`;
    if (id <= 321) return `drizzle.svg`;
    if (id <= 531) return `rain.svg`;
    if (id <= 622) return `snow.svg`;
    if (id <= 781) return `atmosphere.svg`;
    if (id <= 800) return `clear.svg`;
    else return `clouds.svg`;
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-IN', options); 
}

// Renamed function for current weather info
async function getCurrentWeatherInfo(city) {
   const weatherData = await getFetchData('weather', city);
   if (weatherData.cod != 200) {
       showDisplaySection(notFoundSection);
       return;
   }

   const {
       name: country,
       main: { temp, humidity },
       weather: [{ id, main }],
       wind: { speed }
   } = weatherData;

   countryTxt.textContent = country;
   currentDateTxt.textContent = getCurrentDate();
   tempTxt.textContent = Math.round(temp) + ' °C';
   conditionTxt.textContent = main;
   humidityValueTxt.textContent = humidity + '%';
   windValueTxt.textContent = Math.round(speed) + " m/s";
   weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

   // Call the forecast function after displaying current weather info
   getForecastWeatherInfo(city);  
   showDisplaySection(weatherInfoSection);
}

// Renamed function for forecast weather info
async function getForecastWeatherInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    forecastItemsContainer.innerHTML = '';

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    });
}

function updateForecastItems(weatherData) {
    const { dt_txt: date, weather: [{ id }], main: { temp } } = weatherData;
    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-IN', dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">
                ${dateResult}
            </h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="thunderstorm" class="forecast-item-img">
            <h5 class="forecast-item-temp">
                ${Math.round(temp)} °C
            </h5>
        </div>
    `;
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}
