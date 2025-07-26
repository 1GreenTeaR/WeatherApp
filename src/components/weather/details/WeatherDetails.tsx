import style from "styled-components";
import { WeatherDetailsItem } from "./item/WeatherDetailsItem";

type Props = {
  wind: number;
  wetness: number;
  precipitation: number;
  className?: string;
};

const items: {
  name: string;
  value: keyof Pick<Props, "wind" | "wetness" | "precipitation">;
  unit: string;
}[] = [
  { name: "Wind", value: "wind", unit: "m/s" },
  { name: "Humidity", value: "wetness", unit: "%" },
  { name: "Precipitation", value: "precipitation", unit: "mm" },
];

export function WeatherDetails(props: Props) {
  return (
    <Wrapper className={props.className}>
      <div className="box">
        {items.map((item, index) => (
          <>
            <WeatherDetailsItem
              name={item.name}
              value={props[item.value]}
              unit={item.unit}
              className="item"
            ></WeatherDetailsItem>
            {index !== items.length - 1 && <div className="separator"></div>}
          </>
        ))}
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

  .item {
    flex-grow: 1;
    flex-basis: 0;
  }

  .separator {
    width: 3px;
    border-radius: 3px;
    height: 40px;
    background-color: ${(props) => props.theme.palette.text.primary};
    opacity: 0.2;
  }
`;
