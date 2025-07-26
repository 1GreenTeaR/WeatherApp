import style from "styled-components";
import { Tab, Tabs, useTheme } from "@mui/material";
import {
  AreaPlot,
  ChartDataProvider,
  chartsAxisHighlightClasses,
  ChartsSurface,
  ChartsTooltip,
  ChartsXAxis,
  LinePlot,
  useLineSeries,
  useXAxis,
  useXScale,
  useYScale,
} from "@mui/x-charts";
import { useState } from "preact/hooks";
import type { WeatherData } from "../../../app";

import { Icon } from "../../../ui/Icon";

function Point({ x, y }: { x: number; y: number }) {
  const scaleX = useXScale();
  const scaleY = useYScale();

  return (
    <div
      style={{
        position: "absolute",
        left: scaleX(x),
        top: (scaleY(y) ?? 0) - 20,
        translate: "-50% -50%",
        fontSize: 12,
      }}
      className="point"
    >
      {y}
    </div>
  );
}

type LabelMarksProps = {
  shouldMarkRender?: (i: number, x: number, y: number) => boolean;
};

function LabelMarks({ shouldMarkRender }: LabelMarksProps) {
  const series = useLineSeries();
  const xAxis = useXAxis();

  return (
    <>
      {series.map((s) => (
        <>
          {s.data.map(
            (y, i) =>
              (shouldMarkRender?.(i, xAxis.data?.[i], y as number) ?? true) && (
                <Point x={xAxis.data?.[i]} y={y as number} />
              )
          )}
        </>
      ))}
    </>
  );
}

const selectors = {
  temp: "air_temperature",
  wind: "wind_speed",
  humidity: "relative_humidity",
  // precipitation: "precipitation_amount",
} as const;

const properties = {
  temp: { displayName: "Temp (°C)", shouldRound: true, icon: "temp" },
  wind: { displayName: "Wind (m/s)", shouldRound: false, icon: "wind" },
  humidity: {
    displayName: "Humidity (%)",
    shouldRound: true,
    icon: "humidity",
  },
  precipitation: {
    displayName: "Precipitation (mm)",
    shouldRound: true,
    icon: "precipitation",
  },
};

type Props = {
  dailyData: WeatherData["properties"]["timeseries"];
  className?: string;
};

export function WeatherChart({ dailyData, className }: Props) {
  const [value, setValue] = useState<
    "temp" | "wind" | "humidity" | "precipitation"
  >("temp");
  const theme = useTheme();

  console.log(dailyData);

  return (
    <Wrapper className={className}>
      <div className="box">
        <Tabs
          value={value}
          className="chart-selectors"
          centered={true}
          onChange={(_, value) => {
            setValue(value);
          }}
        >
          {Object.keys(properties).map((key) => (
            <Tab
              className="tab-overwrite pointer"
              value={key}
              label={
                <Icon
                  name={properties[key as keyof typeof properties].icon}
                ></Icon>
              }
            ></Tab>
          ))}
        </Tabs>

        <div style={{ position: "relative" }}>
          <ChartDataProvider
            xAxis={[
              {
                data: dailyData.map((d) => new Date(d.time).getHours()),
                valueFormatter: (hours) => hours + ":00",
                scaleType: "point",
                tickLabelInterval: (v, i) =>
                  dailyData.length > 12 ? (i + 3) % 4 === 0 : true,
              },
            ]}
            yAxis={[{ position: "none" }]}
            series={[
              {
                data: dailyData.map((d) =>
                  value === "precipitation"
                    ? (d.data.next_1_hours?.details.precipitation_amount ??
                      d.data.next_6_hours?.details.precipitation_amount)
                    : properties[value].shouldRound
                      ? Math.round(d.data.instant.details[selectors[value]])
                      : d.data.instant.details[selectors[value]]
                ),
                area: true,
                type: "line",
                showMark: true,
                label: properties[value].displayName,
                baseline: "min",
                shape: "circle",
                stack: "total",
                color: theme.palette.primary.light,
              },
            ]}
            height={200}
            margin={{ bottom: 10, top: 30, left: 20, right: 20 }}
          >
            <ChartsSurface
              sx={{
                "& .MuiLineElement-root": {
                  stroke: theme.palette.primary.main,
                  strokeWidth: 5,
                  strokeLinecap: "round",
                },
                "& .MuiAreaElement-root": {
                  fill: "url('#myGradient')",
                },
                [`& .${chartsAxisHighlightClasses.root}`]: {
                  //   fill: "url('#myGradient')",
                  stroke: "none",
                  fill: "blue",
                },
                "& .MuiChartsLegend-root": {
                  display: "none",
                },
                "& .MuiChartsAxis-root": {
                  stroke: theme.palette.text.secondary,
                },
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                  display: "none",
                },
              }}
            >
              <LinePlot />
              <AreaPlot />
              {/* <MarkPlot onItemClick={() => alert(10)} /> */}
              <ChartsTooltip />
              <ChartsXAxis />
              <linearGradient id="myGradient" gradientTransform="rotate(90)">
                <stop
                  offset="0%"
                  stopOpacity={0.14}
                  stopColor={theme.palette.primary.dark}
                />

                <stop
                  offset="100%"
                  stopOpacity={0}
                  stopColor={theme.palette.primary.dark}
                />
              </linearGradient>
            </ChartsSurface>
            <LabelMarks
              shouldMarkRender={
                dailyData.length > 12 ? (i) => (i + 1) % 2 === 0 : undefined
              }
            />
          </ChartDataProvider>
        </div>
      </div>
    </Wrapper>
  );
}
const Wrapper = style.div<{}>`
  .box {
    /* padding: 10px; */
    background-color: ${(props) => props.theme.palette.background.paper};
    /* display: flex; */
    justify-content: space-between;
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    user-select: none;
    }

    @keyframes opacityIn {
      from { opacity: 0;}
      to { opacity: 1;}
    }

    .point {
      color: ${(props) => props.theme.palette.text.secondary};
      font-weight: ${(props) => props.theme.typography.fontWeightBold};
      animation: opacityIn 0.3s forwards;
      opacity: 0;
      animation-delay: 0.2s;
    }
    .chart-selectors{
      
    }
    @media only screen and (max-width: 400px) {
      .tab-overwrite {
        min-width: 70px !important;
      }
  }

    

`;
