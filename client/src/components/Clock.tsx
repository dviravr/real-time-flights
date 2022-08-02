import {useEffect, useState} from "react";

export const Clock = () => {
    const [clockState, setClockState] = useState();

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            // @ts-ignore
            setClockState(date.toLocaleTimeString())
        }, 1000)
    }, [])
    return <div className="clock">{clockState}</div>
}