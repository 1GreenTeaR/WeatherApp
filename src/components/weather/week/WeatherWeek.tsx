import { Tab, Tabs } from "@mui/material";
import style from "styled-components";
import type { WeatherData } from "../../../app";
import { Icon } from "../../../ui/Icon";

const dayDisplayNames: { [key: number]: string } = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  0: "Sun",
};

function getFormattedDate(date: Date) {
  return (
    ("0" + date.getDate()).slice(-2) +
    "." +
    ("0" + (date.getMonth() + 1)).slice(-2)
  );
}

type Props = {
  date: string;
  timeseries: WeatherData["properties"]["timeseries"];
  onChange: (value: string) => void;
};

export function WeatherWeek({ date, timeseries, onChange }: Props) {
  // [{}, {}] -> ['08.07.2025', '09.07.2025']
  const dates = timeseries.map((t) => ({
    date: new Date(t.time),
    temp: t.data.instant.details.air_temperature,
    icon:
      t.data?.next_1_hours?.summary?.symbol_code ??
      t.data?.next_6_hours?.summary?.symbol_code,
  }));

  // date2.getDate() + "." + date2.getMonth() + "." + date2.getFullYear();

  let lastAddedDate = dates[0].date.toDateString();
  const availableDates: {
    date: string;
    minTemp: number;
    maxTemp: number;
    icons: Record<string, number>;
  }[] = [
    {
      date: lastAddedDate,
      minTemp: dates[0].temp as number,
      maxTemp: dates[0].temp as number,
      icons: {},
    },
  ];
  if (dates[0].icon) availableDates[0].icons[dates[0].icon] = 1;
  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i].date.toDateString();
    if (lastAddedDate !== currentDate) {
      lastAddedDate = currentDate;
      availableDates.push({
        date: currentDate,
        minTemp: dates[i].temp!,
        maxTemp: dates[i].temp!,
        icons: dates[i].icon ? { [dates[i].icon]: 1 } : {},
      });
    } else {
      const date = availableDates[availableDates.length - 1];
      const temp = dates[i].temp;
      if (!temp) break;
      if (dates[i].icon === undefined) date.icons[dates[i].icon] = 0;
      date.icons[dates[i].icon] = date.icons[dates[i].icon] + 1;
      if (temp < date.minTemp) date.minTemp = temp;
      if (temp > date.maxTemp) date.maxTemp = temp;
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
          {availableDates.map((a, index) => {
            const iconNames = Object.keys(a.icons);
            let mostCommonIcon = iconNames[0];
            for (let i = 1; i < iconNames.length; i++) {
              if(a.icons[mostCommonIcon] < a.icons[iconNames[i]]){
                mostCommonIcon = iconNames[i]
              }
            }
            return (
              <Tab
                value={a.date}
                className="tab"
                label={
                  <div>
                    <div className="date">
                      {index < 3
                        ? dayDisplayNames[new Date(a.date).getDay()]
                        : getFormattedDate(new Date(a.date))}
                    </div>

                    <img
            draggable={false}
            src={"/icons/" + mostCommonIcon + ".svg"}
            className="icon"
          ></img>
                    <div className="temp-info-box">
                      <div className="temp-max">{Math.round(a.maxTemp)}°</div>
                      <div className="separator">/</div>
                      <div className="temp-min">{Math.round(a.minTemp)}°</div>
                    </div>
                  </div>
                }
              ></Tab>
            );
          })}
        </Tabs>
      </div>
    </Wrapper>
  );
}

const Wrapper = style.div`
.box {
    padding: 20px;
    background-color: ${(props) => props.theme.palette.background.paper};
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    user-select: none;
  }
    .icon{
    filter: brightness(0) invert(1) brightness(0.8);
    padding: 6px 0 0 0;
    }
    .temp-info-box{
    display: flex;
    flex-direction: row;
    gap:4px;
    }
    .date, .temp-min, .temp-max, .separator {
      font-weight: ${(props) => props.theme.typography.fontWeightBold};
      color: ${(props) => props.theme.palette.text.secondary};
      
    }

    .temp-min{
    color: ${(props) => props.theme.palette.text.secondary};
    opacity: 0.6;
    }

    .tab>div {
      transition: filter 0.3s, transform 0.3s;
      transform-style: preserve-3d;
    }

    .tab[aria-selected="true"]>div {
      filter: brightness(1.2);
      transform: translateY(-4px);
    }
`;
