import React, { useState } from "react";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import WeatherCurrent from "./WeatherCurrent";
import WeatherForecast from "./WeatherForecast";

export default function WeatherWrapper() {
  const [search, setSearch] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const searchClick = (e) => {
    
    e.preventDefault();
    setSearchVal("");

    setSearchVal(search);
  };

  return (
    <div>
      {/* <WeatherCurrent/> */}
      <div style={{ width: "420px", margin: "0 auto" }}>
        <InputGroup>
          <Input
            placeholder="Search any city"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <InputGroupText>
            <img
              src="https://freesvg.org/img/system-search.png"
              onClick={searchClick}
              height={40}
              width={40}
            />
          </InputGroupText>
        </InputGroup>
      </div>
      <WeatherForecast searchValue={searchVal} />
    </div>
  );
}
