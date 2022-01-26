
import React from "react";
import { hot } from 'react-hot-loader/root';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/footer/Footer";
import WeatherWrapper from "./components/weather/WeatherWrapper";

class App extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <WeatherWrapper/>
        <Footer/>
      </>
    );
  }
}

export default hot(App);
