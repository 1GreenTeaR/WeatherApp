import { Button, Paper, styled, type Theme } from "@mui/material";
import style from "styled-components";

type Props = {
  unit: "celsius" | "fahrenheit";
  temp: number;
  icon: string;
};

export function WeatherCurrent({ unit, temp, icon }: Props) {
  return (
    <Wrapper>
      <div className="box">
        <div className="icon-container">
          <img
            draggable={false}
            src={"/icons/" + icon + ".svg"}
            className="icon"
          ></img>
        </div>
        <div className="temp-info">
          <div className="temp-container">
            <div className="temp">{`${Math.round(temp)}`}</div>
            <div className="unit">{`${unit === "celsius" ? "°C" : " °F"}`}</div>
          </div>
          <div className="weather-text">{icon.split("_").join(" ")}</div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = style.div<{}>`
  .box {
    padding: 10px;
    background-color: ${(props) => props.theme.palette.background.paper};
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    user-select: none;
  }
  .weather-text {
    color: ${(props) => props.theme.palette.text.secondary};
    font-size: 16px;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    text-transform: capitalize;
    white-space: nowrap;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon-container {
    /* height: 100px; */
    width: 200px;
    position: relative;
    // filter: brightness(0) invert() brightness(80%);
  }
  .icon{
    width: 240px;
    height: 240px;
    position: absolute;
    bottom: 0;
    left: -55px;
  }
  .temp-info {
    position: relative;
    z-index: 1;
  }

  .temp {
    font-size:100px;
    line-height: 1;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    
  }
  .unit {
    padding-top: 6px;
    font-size: 28px;
    font-weight: ${(props) => props.theme.typography.fontWeightBold}
  }
  .temp-container{
    display:flex;
    justify-content: flex-end;
  }
  @media only screen and (max-width: 400px) {
    .icon{
      width: 200px;
      height: 200px;
      bottom: -10px;
      left: -30px;
    }
    .unit{
      font-size:24px;
    }
    .weather-text{
      font-size: 14px;
      max-width: 200px;
    }
    .temp{
      font-size: 80px;
    }
  }


`;
