import { DateRangePickerComp } from "../components/DateRangePicker";
import Button from "@mui/material/Button";

export const FlightsPrediction = () => {

    return (

        <div className="wrapper">
            <div className="container">
                <div className="title">Choose a time range for the Machine Learning model </div>
            </div>
            <div className="container">
                <DateRangePickerComp/>
            </div>
            <Button size={"large"} onClick={() => {
                console.log("clicked");
            }}>
                Apply learning
            </Button>
        </div>
    )
}