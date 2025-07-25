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
        temp={
          data.properties.timeseries[0].data.instant.details.air_temperature
        }
        unit={data.properties.meta.units.air_temperature}
        icon={
          data.properties.timeseries[0].data?.next_1_hours.summary.symbol_code ?? data.properties.timeseries[0].data.next_6_hours.summary.symbol_code
        }
      ></WeatherCurrent>
      <WeatherDetails
        wind={data.properties.timeseries[0].data.instant.details.wind_speed}
        wetness={
          data.properties.timeseries[0].data.instant.details.relative_humidity
        }
        precipitation={
          (data.properties.timeseries[0].data?.next_1_hours.details ?? data.properties.timeseries[0].data.next_6_hours.details)?.precipitation_amount ?? 0
        }
      ></WeatherDetails>
      <WeatherChart
        dailyData={
          new Date(data.properties.timeseries[0].time).toDateString() === date
            ? data.properties.timeseries.slice(0, 24)
            : data.properties.timeseries.filter(
                (t) => new Date(t.time).toDateString() === date
              )
        }
      ></WeatherChart>
      <WeatherWeek
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
`;
