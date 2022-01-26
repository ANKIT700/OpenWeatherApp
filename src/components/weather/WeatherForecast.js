import axios from "axios";
import React, { useEffect, useState } from "react";
import { daysForecastUrl, weatherUrl } from "../../common/AppUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHigh } from "@fortawesome/free-solid-svg-icons";

export default function WeatherForecast(props) {
  const [currentWeather, setCurrentWeather] = useState({});
  const [cityName, setCityName] = useState("");
  const [daysForecast, setDaysForecast] = useState([]);

  useEffect(() => {
    console.log("props.searchValue", props.searchValue);
    let location = "";
    if (props.searchValue !== "") {
      axios
        .get(
          `${weatherUrl}q=${props.searchValue}&units=metric&appid=${process.env.REACT_APP_WEATHERAPIKEY}`
        )
        .then(function (response) {
          // handle success
          location = response.data.name;
          const coordinates = `lat=${response.data.coord.lat}&lon=${response.data.coord.lon}`;

          getWeatherData(coordinates).then((weatherData) => {
            const city = location;

            const dailyForecast = weatherData.daily;

            renderData(city, dailyForecast);
          });
        });
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
          axios
            .get(
              `${weatherUrl}${coordinates}&units=metric&appid=${process.env.REACT_APP_WEATHERAPIKEY}`
            )
            .then(function (response) {
              // handle success
              location = response.data.name;
              getWeatherData(coordinates).then((weatherData) => {
                const city = location;

                const dailyForecast = weatherData.daily;

                renderData(city, dailyForecast);
              });
            });
          // run/render the widget data
        },
        (e) => console.log(e)
      );
    } else {
      console.log("unable to retrieve location from browser");
    }
    // fetch(`${daysForecastUrl}${cityName}&appid=${process.env.REACT_APP_WEATHERAPIKEY}`)
    // .then(response => response.json())
    // .then(data => {
    //     setWeather(data);
    // });
  }, [props.searchValue]);

  function getWeatherData(position) {
    // const headers = new Headers();
    // const URL = `https://api.openweathermap.org/data/2.5/forecast/daily?${position}&cnt=7&units=imperial&APPID=${process.env.REACT_APP_WEATHERAPIKEY}`;

    // return fetch(URL, {
    //   method: 'GET',
    //   headers: headers
    // }).then(data => data.json());

    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?${position}&exclude=current,minutely,hourly,alerts&units=metric&APPID=${process.env.REACT_APP_WEATHERAPIKEY}`
    ).then((response) => response.json());
  }
  const renderData = (location, forecast) => {
    const currentWeather = forecast[0].weather[0];
    setCurrentWeather(currentWeather);
    setCityName(location);
    setDaysForecast(forecast);
  };

  return (
    <div class="component__weather-box">
      <div class="component__weather-content">
        <div class="weather-content__overview">
          <h1>{cityName}</h1>
          <h5>{currentWeather.description}</h5>
        </div>
        <div class="weather-content__temp">
          {currentWeather && currentWeather.icon && (
            <img
              src={`https://openweathermap.org/img/w/${currentWeather.icon}.png`}
            />
          )}
          {Math.round(daysForecast[0]?.temp?.day || 0)}
          <FontAwesomeIcon icon={faTemperatureHigh} size="xs" />
        </div>
      </div>
      <div class="component__forecast-box">
        {daysForecast.map((day) => {
          let date = new Date(day.dt * 1000);
          let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
          let name = days[date.getDay()];
          return (
            <div class="forecast__item">
              <div class="forecast-item__heading">
                {date.getDate()} {name}
              </div>
              <div class="forecast-item__info">
                <img
                  src={`https://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                />
                <span class="degrees">{Math.round(day.temp.day)} º</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
