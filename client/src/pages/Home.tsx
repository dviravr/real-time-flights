import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { FlightsTable } from "../components/flightsTable";
import {useEffect, useState} from "react";
import { io } from "socket.io-client";
import flights from '../components/mock.json';
import { Flight } from '../components/flightsTable'

// @ts-ignore
let arrivingFlightsDefault: Flight[] = Object.values(flights);
// @ts-ignore
let departuresFlightsDefault: Flight[] = Object.values(flights);

let socket = null;

export const Home = () => {
    useEffect(() => {
        socket = io('http://localhost:5001', {
            transports: ["websocket"]
        });

        socket.on('connect', () => {
            console.log('connected from client');
        });

        socket.on('arriving-flights-update', (data) => {
            arrivingFlightsDefault = Object.values(data.flights);
            console.log('arriving flights updated');
        });

        socket.on('departures-flights-update', (data) => {
            departuresFlightsDefault = Object.values(data.flights);
            console.log('departures flights updated');
        });
    }, []);


    const [departuresFlights, setDeparturesFlights] = useState(departuresFlightsDefault);
    const [arrivingFlights, setArrivingFlights] = useState(arrivingFlightsDefault);
    const [showIncoming, setShowIncoming] = useState(false);
    const [showOutgoing, setShowOutgoing] = useState(false);
    // @ts-ignore
    return (
        <div className="wrapper">
            <div className="item-flights">
                <div>
                    <button className="incomingFlights" onClick={() => {
                        // @ts-ignore
                        // setArrivingFlights()
                        setShowIncoming(!showIncoming);
                    }}>
                        Incoming Flights - 55
                    </button>
                    {
                        showIncoming? <FlightsTable flights={arrivingFlightsDefault}/> : null
                    }
                </div>
                <div>
                    <button className="outgoingFlights" onClick={() => {
                        setShowOutgoing(!showOutgoing);
                    }}>
                        Outgoing Flights - 55
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
                <Map/>
            </div>
            <div className="item clock">
                <Clock/>
            </div>
        </div>
    )
}