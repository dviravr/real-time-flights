import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { FlightsTable } from "../components/flightsTable";
import {useEffect, useState} from "react";
import { io } from "socket.io-client";
import flights from '../components/mock.json';
import { Flight } from '../components/flightsTable';

// @ts-ignore
let arrivingFlightsDefault: Flight[] = Object.values(flights);
// @ts-ignore
let departuresFlightsDefault: Flight[] = Object.values(flights);
// @ts-ignore
let allFlightsDefault: Flight[] = arrivingFlightsDefault.concat(departuresFlightsDefault);


let socket = null;

export const Home = () => {
    useEffect(() => {
        socket = io('http://localhost:5001', {
            transports: ["websocket"]
        });

        socket.on('connect', () => {
            // console.log('connected from client');
        });

        socket.on('arriving-flights-update', (data) => {
            arrivingFlightsDefault = Object.values(data.flights);
            setArrivingFlights(arrivingFlightsDefault);
            // console.log('arriving flights updated');
        });

        socket.on('departures-flights-update', async (data) => {
            departuresFlightsDefault = Object.values(data.flights);
            setDeparturesFlights(departuresFlightsDefault);

            // Apply learning
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ flights: departuresFlightsDefault })
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
            // console.log('departures flights updated');
        });

        socket.on('all-flights-update', (data) => {
            let departuresFlights: Flight[] = Object.values(data.departures);
            let arrivalsFlights: Flight[] = Object.values(data.arrivals);

            allFlightsDefault = departuresFlights.concat(arrivalsFlights);
            setAllFlights(allFlightsDefault);
            // console.log('all flights updated');
        });
    }, []);


    const [departuresFlights, setDeparturesFlights] = useState(departuresFlightsDefault);
    const [arrivingFlights, setArrivingFlights] = useState(arrivingFlightsDefault);
    const [allFlights, setAllFlights] = useState(allFlightsDefault);
    const [showIncoming, setShowIncoming] = useState(false);
    const [showOutgoing, setShowOutgoing] = useState(false);
    // @ts-ignore
    return (
        <div className="wrapper">
            <div className="item-flights">
                <div>
                    <button className="incomingFlights" onClick={() => {
                        // @ts-ignore
                        setShowIncoming(!showIncoming);
                    }}>
                        Arriving - {arrivingFlightsDefault.length}
                    </button>
                    {
                        showIncoming? <FlightsTable flights={arrivingFlightsDefault}/> : null
                    }
                </div>
                <div>
                    <button className="outgoingFlights" onClick={() => {
                        setShowOutgoing(!showOutgoing);
                    }}>
                        Departures - {departuresFlightsDefault.length}
                    </button>
                    {
                        showOutgoing? <FlightsTable flights={departuresFlightsDefault}/> : null
                    }
                </div>
                <div className="weather">
                    <a className="weatherwidget-io" href="https://forecast7.com/en/32d0934d78/tel-aviv-yafo/"
                       data-label_1="TEL AVIV" data-label_2="WEATHER" data-mode="Current" data-theme="weather_one">
                        TEL AVIV WEATHER </a>
                </div>
            </div>
            <div className="item map">
                <Map flights={allFlightsDefault}/>
            </div>
            <div className="item clock">
                <Clock/>
            </div>
        </div>
    )
}