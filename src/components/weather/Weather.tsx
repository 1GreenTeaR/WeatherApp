import { styled } from "styled-components";
import { WeatherCurrent } from "./current/WeatherCurrent";
import type { WeatherData } from "../../app";
import { WeatherDetails } from "./details/WeatherDetails";
import { WeatherChart } from "./chart/WeatherChart";
import { WeatherWeek } from "./week/WeatherWeek";
import { useState } from "preact/hooks";

type Props = {
  data: WeatherData;
};

export function Weather({ data }: Props) {
  const [date, setDate] = useState(
    new Date(data.properties.timeseries[0].time).toDateString()
  );
  function onDateChange(value: string) {
    setDate(value);
  }

  return (
    <Wrapper>
      <WeatherCurrent
        className="current"
        temp={
          data.properties.timeseries[0].data.instant.details.air_temperature
        }
        unit={data.properties.meta.units.air_temperature}
        icon={
          data.properties.timeseries[0].data?.next_1_hours.summary
            .symbol_code ??
          data.properties.timeseries[0].data.next_6_hours.summary.symbol_code
        }
      ></WeatherCurrent>
      <WeatherDetails
        className="details"
        wind={data.properties.timeseries[0].data.instant.details.wind_speed}
        wetness={
          data.properties.timeseries[0].data.instant.details.relative_humidity
        }
        precipitation={
          (
            data.properties.timeseries[0].data?.next_1_hours.details ??
            data.properties.timeseries[0].data.next_6_hours.details
          )?.precipitation_amount ?? 0
        }
      ></WeatherDetails>
      <WeatherChart
        className="chart"
        dailyData={
          new Date(data.properties.timeseries[0].time).toDateString() === date
            ? data.properties.timeseries.slice(0, 24)
            : data.properties.timeseries.filter(
                (t) => new Date(t.time).toDateString() === date
              )
        }
      ></WeatherChart>
      <WeatherWeek
        className="week"
        timeseries={data.properties.timeseries}
        date={date}
        onChange={onDateChange}
      ></WeatherWeek>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes opacityIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100px) scale(1);
    }
    to {
      transform: translateY(0) scale(1);
    }
  }

  @keyframes backfropFilterDelay {
    0% {
      backdrop-filter: none;
    }
    80% {
      backdrop-filter: none;
    }
    100% {
      backdrop-filter: blur(6px);
    }
  }

  .box {
    backdrop-filter: blur(6px);
    animation: backfropFilterDelay 1.6s;
  }

  .current {
    animation:
      scaleIn 0.5s ease-out,
      opacityIn 0.5s ease-out;
    backdrop-filter: unset;
  }

  .current .icon-container {
    animation:
      scaleIn 0.5s ease-out,
      opacityIn 0.5s ease-out;
  }

  .details {
    transform-origin: top;
    animation:
      slideDown 0.5s ease-in-out,
      opacityIn 0.5s ease-out;
    animation-delay: 0.3s;
    animation-fill-mode: both;
  }

  .chart,
  .week {
    animation:
      slideDown 0.5s ease-in-out,
      opacityIn 0.5s ease-out;
    animation-delay: 0.6s;
    animation-fill-mode: both;
  }

  .week {
    animation-delay: 0.9s;
  }
`;
