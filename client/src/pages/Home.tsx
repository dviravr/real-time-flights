import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { Flight, FlightsTable, prediction } from "../components/flightsTable";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { omit } from 'lodash';

// @ts-ignore
let arrivingFlightsDefault: Flight[] = [];
// @ts-ignore
let departuresFlightsDefault: Flight[] = [];
// @ts-ignore
let allFlightsDefault: Flight[] = arrivingFlightsDefault.concat(departuresFlightsDefault);

let arrivingPredictions: prediction;

let departuresPredictions: prediction;

async function predictFlights(flight: Flight[]) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flights: flight.map(flight => {
                    return omit(flight, "trail")
                })
            })
        };
        const response = await fetch('http://localhost:5003/bigml/predictFlights', requestOptions);

        // debugger;

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

        socket.on('arriving-flights-update', async (data) => {
            arrivingFlightsDefault = Object.values(data.flights);
            arrivingPredictions = await predictFlights(arrivingFlightsDefault);
            console.log("prediction: ", arrivingPredictions);
            setArrivingFlights(arrivingFlightsDefault);
            // console.log('arriving flights updated');
        });

        socket.on('departures-flights-update', async (data) => {
            departuresFlightsDefault = Object.values(data.flights);
            departuresPredictions = await predictFlights(departuresFlightsDefault);
            setDeparturesFlights(departuresFlightsDefault);
            // console.log('departures flights updated');
        });

        socket.on('all-flights-update', (data) => {
            let departuresFlights: Flight[] = Object.values(data.departures);
            let arrivalsFlights: Flight[] = Object.values(data.arrivals);

            allFlightsDefault = departuresFlights.concat(arrivalsFlights);
            // predictFlights(allFlightsDefault);
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