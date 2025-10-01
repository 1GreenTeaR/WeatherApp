import { useEffect, useState } from "preact/hooks";
import "./app.css";
import {
  type Theme,
  CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { Weather } from "./components/weather/Weather";
import { ThemeProvider } from "styled-components";
import { useCustomPointer } from "./hooks/useCustomPointer";

const baseTheme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Lato",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  defaultColorScheme: "light",
  colorSchemes: { dark: false, light: true },

  shape: {
    borderRadius: 24,
  },

  palette: {
    primary: {
      main: "#04c5cf",
    },
    secondary: {
      main: "#edf2ff",
    },
    // background: {
    //   default: "#101728",
    //   // paper: "#0c101b6e",
    //   paper: "#242b4b70",
    // },
    background: {
      default: "#101728",
      // paper: "#0c101b6e",
      paper: "#242b4b30",
    },

    text: {
      primary: "#f2f2f2",
      secondary: "#a8a9b5",
      disabled: "#a8a9b588",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

type WeatherDetails = {
  air_pressure_at_sea_level: number;
  air_temperature: number;
  cloud_area_fraction: number;
  relative_humidity: number;
  wind_from_direction: string;
  wind_speed: number;
  precipitation_amount: number;
};

// type keys = keyof WeatherDetails;

// type Optional<T> = {
//   [key in keyof T]?: T[key];
// };

// const y : Test<WeatherDetails> = {};

export type WeatherData = {
  geometry: { coordinates: [number, number, number] };
  properties: {
    meta: {
      units: {
        air_pressure_at_sea_level: "hPa";
        air_temperature: "celsius" | "fahrenheit";
        cloud_area_fraction: "%";
        precipitation_amount: "mm";
        relative_humidity: "%";
        wind_from_direction: "degrees";
        wind_speed: "m/s";
      };
    };
    timeseries: {
      time: string;
      data: {
        instant: {
          details: WeatherDetails;
        };
        next_1_hours: {
          details: Partial<WeatherDetails> & { precipitation_amount: number };
          summary: { symbol_code: string };
        };
        next_6_hours: {
          details: Partial<WeatherDetails> & { precipitation_amount: number };
          summary: { symbol_code: string };
        };
      };
    }[];
  };
};

export function App() {
  const [data, setData] = useState<WeatherData | undefined>(undefined);

  useCustomPointer();

  useEffect(() => {
    fetch(
      "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=58.5953&lon=25.0136",
      { method: "GET" }
    ).then((response) => {
      response.json().then((data) => {
        setData(data);
      });
    });
  }, []);

  console.log(data);
  return (
    <MuiThemeProvider theme={baseTheme}>
      <ThemeProvider theme={baseTheme}>
        <CssBaseline enableColorScheme />
        <div className="weather-wrapper">
          {data === undefined ? (
            <div className="circular-loading">
              <CircularProgress />
            </div>
          ) : (
            <Weather data={data}></Weather>
          )}
        </div>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
