import { Tab, Tabs } from "@mui/material";
import style from "styled-components";
import type { WeatherData } from "../../../app";

// const selectors = {
//   0: "Monday",
//   1: "Tuesday",
//   2: "Wedensday",
//   3: "Thursday",
//   4: "Friday",
//   5: "Saturday",
//   6: "Sunday",
// } as const;

type Props = {
  date: string;
  timeseries: WeatherData["properties"]["timeseries"];
  onChange: (value: string) => void;
};

export function WeatherWeek({ date, timeseries, onChange }: Props) {
  // [{}, {}] -> ['08.07.2025', '09.07.2025']
  const dates = timeseries.map((t) => new Date(t.time));
  const date2 = new Date();
  // date2.getDate() + "." + date2.getMonth() + "." + date2.getFullYear();

  let lastAddedDate = dates[0].toDateString();
  let availableDates = [lastAddedDate];
  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i].toDateString();
    if (lastAddedDate !== currentDate) {
      lastAddedDate = currentDate;
      availableDates.push(currentDate);
    }
  }
  console.log(availableDates);
  // console.log(dates);
  return (
    <Wrapper>
      <div className="box">
        <Tabs
          value={date}
          variant="scrollable"
          scrollButtons="auto"
          onChange={(_, value) => {
            onChange(value);
          }}
        >
          {availableDates.map((a) => (
            <Tab value={a} label={a}></Tab>
          ))}
        </Tabs>
      </div>
    </Wrapper>
  );
}

const Wrapper = style.div<{}>`
.box {
    padding: 20px;
    background-color: ${(props) => props.theme.palette.background.paper};
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    user-select: none;
  }
`;
