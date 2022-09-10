import { Clock } from '../components/Clock'
import { DateRangePickerComp } from "../components/DateRangePicker";
import Button from "@mui/material/Button";

export const FlightsPrediction = () => {
    const handleClick = async () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flights: {} })
            };
            const response = await fetch('http://localhost:5003/bigml/predictFlight', requestOptions);

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('result is: ', JSON.stringify(result, null, 4));

            // setData(result);
        } catch (err) {
            // setErr(err.message);
        } finally {
            // setIsLoading(false);
        }
    }

    return (

        <div className="wrapper">
            <div className="container">
                <div className="title">Choose a time range for the Machine Learning model </div>
            </div>
            <div className="container">
                <DateRangePickerComp/>
            </div>
            <Button size={"large"} onClick={() => {
                console.log("click")
                handleClick();
            }}>
                Apply learning
            </Button>
            {/*<Clock/>*/}
        </div>
    )
}