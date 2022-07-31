import { Map } from '../components/Map'
import { Clock } from '../components/Clock'
import { Weather } from '../components/Weather'

export const Home = () => {
    return (
        <div className="wrapper">
            <div className="container">
                <div className="left">Incoming flights</div>
                <div className="right">Weather Widget</div>
                <div className="center">Outgoing flights</div>
            </div>
            <Map/>
            <Clock/>
        </div>
    )
}