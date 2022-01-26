import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactAnimatedWeather from "react-animated-weather/build/ReactAnimatedWeather";
import { geolocated } from "react-geolocated";
import {
  Alert,
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";
import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "@emotion/react";

const defaults = {
  icon: "CLEAR_DAY",
  color: "goldenrod",
  size: 512,
  animate: true,
};
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const Weather = (props) => {
  const [state, setState] = useState({
    lat: null,
    lon: null,
    city: null,
    temperatureC: null,
    temperatureF: null,
    humidity: null,
    main: null,
    country: null,
    icon: null,
    date: null,
    description: null,
    maxtem: null,
    mintem: null,
    temday: null,
  });
  const [loader, setLoader] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  //   useEffect(() => {
  //     getWeather();
  //   }, []);

  useEffect(() => {
    search("Delhi");
  }, []);

  const getWeather = async () => {
    debugger;
    console.log(props);
    const location = window.navigator && window.navigator.geolocation;

    if (location) {
      location.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=
              ${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHERAPIKEY}`
            )
            .then(function (response) {
              // handle success
              console.log(response);
              setWeather(response.data);
              const data = response.data;
              setState({
                lat: lat,
                lon: lon,
                city: data.name,
                temperatureC: Math.round(data.main.temp),
                temperatureF: Math.round(data.main.temp * 1.8 + 32),
                humidity: data.main.humidity,
                main: data.weather[0].main,
                country: data.sys.country,
              });
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        },
        (error) => {},
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    }
  };
  const search = (city) => {
    // alert(city);
    setLoader(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${process.env.REACT_APP_WEATHERAPIKEY}`
      )
      .then((response) => {
        setLoader(false);
        setWeather(response.data);
        const data = response.data;

        const copyState = { ...state };
        copyState.city = data.name;
        copyState.temperatureC = Math.round(data.main.temp);
        copyState.temperatureF = Math.round(data.main.temp * 1.8 + 32);
        copyState.humidity = data.main.humidity;
        copyState.main = data.weather[0].main;
        copyState.country = data.sys.country;
        copyState.icon = data.weather[0].icon;
        copyState.date = data.dt;
        copyState.description = data.weather[0].description;
        copyState.maxtem = data.main.temp_max;
        copyState.mintem = data.main.temp_min;
        copyState.temday = data.main.temp;
        setState(copyState);

        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setLoader(false);

        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };
  const formatDate = (timestamp) => {
    var day = moment(timestamp * 1000).format("dddd");
    return day;
  };
  const getWeatherIcon = (type) => {
    const copyState = { ...state };
    switch (type) {
      case "Haze":
        copyState.icon = "CLEAR_DAY";
        break;
      case "Clouds":
        copyState.icon = "CLOUDY";
        break;
      case "Rain":
        copyState.icon = "RAIN";
        break;
      case "Snow":
        copyState.icon = "SNOW";
        break;
      case "Dust":
        copyState.icon = "WIND";
        break;
      case "Drizzle":
        copyState.icon = "SLEET";
        break;
      case "Fog":
        copyState.icon = "FOG";
        break;
      case "Smoke":
        copyState.icon = "FOG";
        break;
      case "Tornado":
        copyState.icon = "WIND";
        break;
      default:
        copyState.icon = "CLEAR_DAY";
    }
    setState(copyState);
  };
  //   switch (this.state.main) {
  //     case "Haze":
  //       this.setState({ icon: "CLEAR_DAY" });
  //       break;
  //     case "Clouds":
  //       this.setState({ icon: "CLOUDY" });
  //       break;
  //     case "Rain":
  //       this.setState({ icon: "RAIN" });
  //       break;
  //     case "Snow":
  //       this.setState({ icon: "SNOW" });
  //       break;
  //     case "Dust":
  //       this.setState({ icon: "WIND" });
  //       break;
  //     case "Drizzle":
  //       this.setState({ icon: "SLEET" });
  //       break;
  //     case "Fog":
  //       this.setState({ icon: "FOG" });
  //       break;
  //     case "Smoke":
  //       this.setState({ icon: "FOG" });
  //       break;
  //     case "Tornado":
  //       this.setState({ icon: "WIND" });
  //       break;
  //     default:
  //       this.setState({ icon: "CLEAR_DAY" });
  //   }

  console.log("state.city", state.city);
  return (
    <div>
      <h1>Weather</h1>

      <div className="img-box">
        {" "}
        <input
          type="text"
          className="search-bar"
          placeholder="Search any city"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <img
          src="https://freesvg.org/img/system-search.png"
          onClick={search}
          height={40}
          width={40}
        />
      </div>
      {/* <ReactAnimatedWeather
    icon={defaults.icon}
    color={defaults.color}
    size={defaults.size}
    animate={defaults.animate}
  /> */}
      <Row>
        <Col>
          <Row className="row bg-light mt-1">
            {loader ? (
              <ScaleLoader
                color={"#D0021B"}
                loading={true}
                css={override}
                size={150}
              />
            ) : (
              <Col className="p-4">
                <h1>{state.city}</h1>
                {/* <h5> day weather</h5> */}
              </Col>
            )}
          </Row>
          <Row key={state.date} className="row bg-light mt-1">
            {loader ? (
              <ScaleLoader
                color={"#D0021B"}
                loading={true}
                css={override}
                size={150}
              />
            ) : (
              <Col className="col-md-12 d-flex p-3">
                <div className="mr-auto p-2 bd-highlight">
                  <h5>{formatDate(state.date)}</h5>
                </div>
                <h1>{Math.round(state.temday)}&deg;</h1>
                <div className="p-2 bd-highlight">
                  {state && state.icon && (
                    <img
                      src={`https://openweathermap.org/img/w/${state.icon}.png`}
                    />
                  )}
                </div>
                <div className="p-2 bd-highlight">
                  <strong>{state.main}</strong> <br />{" "}
                  <span className="small">{state.description}</span>
                </div>
                <div className="p-2 bd-highlight">
                  {Math.round(state.maxtem)}&deg; / {Math.round(state.mintem)}{" "}
                </div>
                &deg;
              </Col>
            )}
          </Row>
        </Col>
        {/* <Card>
          <CardBody>
            <CardTitle tag="h5">
              <img
                alt="Card image cap"
                src={`https://openweathermap.org/img/w/${state.icon}.png`}
                width="100px"
              />
              {state.city}
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {formatDate(state.date)} {Math.round(state.temday)}&deg;
              </CardSubtitle>
            </CardTitle>

            <CardText>
              <div className="p-2 bd-highlight">
                <strong>{state.main}</strong> <br />
                <span className="small">{state.description}</span>
              </div>
            </CardText>
            <Button>
              <div className="p-1 bd-highlight">
                {Math.round(state.maxtem)}&deg; / {Math.round(state.mintem)}{" "}
              </div>
                &deg;
            </Button>
          </CardBody>
        </Card> */}
      </Row>
    </div>
  );
};

export default geolocated()(Weather);
