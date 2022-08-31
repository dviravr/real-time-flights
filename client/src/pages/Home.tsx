import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { SidePanel } from '../components/SidePanel'
import { FlightsTable } from "../components/flightsTable";
import {useEffect, useState} from "react";

const handleClick = (flights: string) => {
    console.log("button clicked", flights)
}

export const Home = () => {
    const [showIncoming, setShowIncoming] = useState(false);
    const [showOutgoing, setShowOutgoing] = useState(false);
    // @ts-ignore
    return (
        <div className="wrapper">
            <div className="item-flights">
                <div>
                    <button className="incomingFlights" onClick={() => {
                        setShowIncoming(!showIncoming);
                    }}>
                        Incoming Flights - 55
                    </button>
                    {
                        showIncoming? <FlightsTable/> : null
                    }
                </div>
                <div>
                    <button className="outgoingFlights" onClick={() => {
                        setShowOutgoing(!showOutgoing);
                    }}>
                        Outgoing Flights - 55
                    </button>
                    {
                        showOutgoing? <FlightsTable/> : null
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