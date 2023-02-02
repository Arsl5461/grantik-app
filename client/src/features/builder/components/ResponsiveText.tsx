import DatGui, { DatString, DatColor, DatNumber, DatSelect } from "react-dat-gui";
import fonts from "./font";
import "./style.css";



export default function ResponsiveText({ opts, setOpts }: any) {
  return (
    <>
      <DatGui data={opts} onUpdate={setOpts}>
        <DatNumber label="Leturstærð" path="fontSize" min={0.01} max={2} step={0.01} />
        <DatNumber label="Hámarks breidd" path="maxWidth" min={50} max={500} step={1} />
        <DatNumber label="Hæð línu" path="lineHeight" min={0.5} max={2} step={0.1} />
        <DatNumber label="Stafabil" path="letterSpacing" min={-0.1} max={0.5} step={0.01} />
        <DatSelect label="Letur" path="font" options={Object.keys(fonts)} />
        <DatSelect
          label="Textajöfnun"
          path="textAlign"
          options={["left", "center", "right", "justify"]}
        />
      </DatGui>
    </>
  );
}
