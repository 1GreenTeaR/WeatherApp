import style from "styled-components";
type Props = {
  name: string;
  value: number;
  unit: string;
  className?: string;
};

export function WeatherDetailsItem({ name, value, unit, className }: Props) {
  return (
    <Wrapper className={className}>
      <div className="info">
        <div className="value">{value}</div>
        <div className="unit">{unit}</div>
      </div>
      <div className="name"> {name} </div>
    </Wrapper>
  );
}

const Wrapper = style.div<{}>`
  display: flex;
  flex-direction: column;
  align-items:center;

  .info {
    display: flex;
    align-items: end;
    gap: 4px;
  }
  .value{
    font-size:28px;
    line-height: 1;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
  }
  .unit{
    font-size:16px;
    line-height: 1;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    color: ${(props) => props.theme.palette.text.secondary}
  }
  .name{
    font-size:18px;
    line-height: 1;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    color: ${(props) => props.theme.palette.text.secondary};
    padding-top: 10px;
};
@media only screen and (max-width: 400px) {
  .value {
    font-size:20px;
  }
  .unit {
    font-size: 14px;
  }
  .name{
    font-size: 14px;
  }

}
 
`;
