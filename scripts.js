const baseUrl = 'http://api.weatherapi.com/v1';
const apiKey = 'key=e55e609877d54486be9191457211210';

let ipLocation = [];
let ipZip;
let currentWeather = [];
let forecastWeather = [];
let forecastDay;
let forecastHour = [];
let hrsArray = [];
let boxes;

getIp();

let searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', (e) => {
    let str = e.target.value.toLowerCase();
    let url = baseUrl + '/search.json?' + apiKey + 'q=' + str;
    
    /*fetch(url)
        .then(response => response.json)
        .then(data => )*/

    // create div to hold search results
    // div not visible unless searching
    // show results in div on keyup
});

function getIp() {
    fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        ipLocation = data;
        ipZip = ipLocation.postal;
        getForecast(ipZip);
    });
}

function getForecast(location) {
    fetch(baseUrl + '/forecast.json?' + apiKey + `&q=${location}` + '&days=2')
    .then(response => response.json())
    .then(data => {
        currentWeather = data;
        forecastWeather = data.forecast.forecastday[0];
        forecastHour = forecastWeather.hour;
        forecastDay = data.forecast.forecastday[1];
        drawCurrentWeather(currentWeather);
        drawWeeklyForecast(forecastDay);
        let dayOne = currentWeather.forecast.forecastday[0].hour;
        let dayTwo = currentWeather.forecast.forecastday[1].hour;
        hrsArray = [...dayOne, ...dayTwo];
        drawHourlyForecast(hrsArray);
    });
}

function drawCurrentWeather(weather) {
    document.getElementById('city-name').innerHTML = weather.location.name;
    document.getElementById('current-condition').innerHTML = weather.current.condition.text;
    document.getElementById('current-temp').innerHTML = Math.round(weather.current.temp_f) + `&#176`;
    document.getElementById('current-icon').innerHTML = `<img src='${weather.current.condition.icon}'>`;
    let dayObj = weather.forecast.forecastday[0].day;
    document.getElementById('current-high').innerHTML = 'H:' + Math.round(dayObj.maxtemp_f) + '&#176';
    document.getElementById('current-low').innerHTML = 'L:' + Math.round(dayObj.mintemp_f) + '&#176';
}

function drawHourlyForecast(fcastArr) {
    let currentTime = currentWeather.current.last_updated_epoch;
    let d = new Date(currentTime * 1000);
    let currentHour = d.getHours();
    let twelveHrs = fcastArr.slice(currentHour, currentHour + 13);
    twelveHrs.forEach(hour => createHourlyBox(hour));
    boxes = document.getElementsByClassName('hour-time');
    boxes[0].innerHTML = 'Now';
}

function convertToHour(epoch) {
    let d = new Date(epoch * 1000);
    let h = d.getHours();
    if (h > 12) { return h - 12 + 'PM'; }
    else if (h == 0) { return 12 + 'AM'}
    else if (h == 12) { return 12 + 'PM' }
    else { return h + 'AM' };
}

function createHourlyBox(hour) {
    let parent = document.getElementById('hourly-weather');
    let child = document.createElement('div');
    let time = convertToHour(hour.time_epoch);
    let iconUrl = hour.condition.icon;
    let temp = Math.round(hour.temp_f) + '&#176';
    child.classList.add('hourly-box');
    child.innerHTML = 
        `<span class="hour-time">${time}</span>
        <img class="hour-icon" src="${iconUrl}"></img>
        <span class="hour-temp">${temp}</span>`;
    parent.appendChild(child);
}

function drawWeeklyForecast(fcast) {
    let day = fcast.day;
    let parent = document.getElementById('weekly-weather');
    let child = document.createElement('div');
    let weathCond = day.condition.text;
    let iconUrl = day.condition.icon;
    let temp = Math.round(day.avgtemp_f);
    let high = Math.round(day.maxtemp_f);
    let low = Math.round(day.mintemp_f);
    let rain = Math.round(day.daily_chance_of_rain);
    let humidity = Math.round(day.avghumidity);
    child.classList.add('weekly-box');
    child.innerHTML = 
        `<span class="daily-left">
            <span class="text">Tomorrow</span>
            <span class="daily-graphic">
                <img class="daily-icon" src="${iconUrl}"></img>
                <span class="daily-temp">${temp}&#176</span>
            </span>
            <span class="daily-condition">${weathCond}</span>
        </span>
        <span class="daily-right">
            <span class="daily-hi-lo">
                <span class="daily-text">High: <br />${high}&#176</span>
                <span class="daily-text">Low: <br />${low}&#176</span>
            </span>
            <span class="daily-rain">
                <span class="daily-text">Humidity: <br />${humidity}%</span>
                <span class="daily-text">Chance of Rain: <br />${rain}%</span>
            </span>
        </span>`;
    parent.appendChild(child);
}

