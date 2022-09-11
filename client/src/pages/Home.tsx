import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { FlightsTable, prediction } from "../components/flightsTable";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { omit } from 'lodash';
import { Flight } from 'real-time-flight-lib';

// @ts-ignore
let takeoffFlightsDefault: Flight[] = [];
// @ts-ignore
let arrivingFlightsDefault: Flight[] = [];
// @ts-ignore
let departuresFlightsDefault: Flight[] = [];
// @ts-ignore
let allFlightsDefault: Flight[] = arrivingFlightsDefault.concat(departuresFlightsDefault);

let arrivingPredictions: prediction;

let departuresPredictions: prediction;

let takeoffPredictions: prediction;

async function predictFlights(flight: Flight[], isOnair: boolean) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flights: flight.map(flight => omit(flight, "trail")), isOnair })
        };
        const response = await fetch('http://localhost:5003/bigml/predictFlights', requestOptions);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }


        return await response.json();
    } catch (err) {
        console.error("error: ", err);
    }
}

let socket = null;

export const Home = () => {
    useEffect(() => {
        socket = io('http://localhost:5001', {
            transports: ["websocket"]
        });

        socket.on('connect', () => {
            // console.log('connected from client');
        });

        socket.on('takeoff-flights-update', async (data) => {
            takeoffFlightsDefault = data.flights;
            arrivingPredictions = await predictFlights(takeoffFlightsDefault, false);
            setTakeoffFlights(takeoffFlightsDefault);
        });

        socket.on('arriving-flights-update', async (data) => {
            arrivingFlightsDefault = Object.values(data.flights);
            arrivingPredictions = await predictFlights(arrivingFlightsDefault, true);
            setArrivingFlights(arrivingFlightsDefault);
        });

        socket.on('departures-flights-update', async (data) => {
            departuresFlightsDefault = Object.values(data.flights);
            departuresPredictions = await predictFlights(departuresFlightsDefault, true);
            setDeparturesFlights(departuresFlightsDefault);
        });

        socket.on('all-flights-update', (data) => {
            let departuresFlights: Flight[] = Object.values(data.departures);
            let arrivalsFlights: Flight[] = Object.values(data.arrivals);

            allFlightsDefault = departuresFlights.concat(arrivalsFlights);
            setAllFlights(allFlightsDefault);
        });
    }, []);


    const [takeoffFlights, setTakeoffFlights] = useState(takeoffFlightsDefault);
    const [departuresFlights, setDeparturesFlights] = useState(departuresFlightsDefault);
    const [arrivingFlights, setArrivingFlights] = useState(arrivingFlightsDefault);
    const [allFlights, setAllFlights] = useState(allFlightsDefault);
    const [showIncoming, setShowIncoming] = useState(false);
    const [showOutgoing, setShowOutgoing] = useState(false);
    const [showTakeoff, setShowTakeoff] = useState(false);
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
                        showIncoming? <FlightsTable flights={arrivingFlightsDefault} predictions={arrivingPredictions}/> : null
                    }
                </div>
                <div>
                    <button className="outgoingFlights" onClick={() => {
                        setShowOutgoing(!showOutgoing);
                    }}>
                        Departures - {departuresFlightsDefault.length}
                    </button>
                    {
                        showOutgoing? <FlightsTable flights={departuresFlightsDefault} predictions={departuresPredictions}/> : null
                    }
                </div>
                <div>
                    <button className="takeoffFlights" onClick={() => {
                        setShowOutgoing(!showTakeoff);
                    }}>
                        Takeoff - {takeoffFlightsDefault.length}
                    </button>
                    {
                        showTakeoff? <FlightsTable flights={takeoffFlightsDefault} predictions={takeoffPredictions}/> : null
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