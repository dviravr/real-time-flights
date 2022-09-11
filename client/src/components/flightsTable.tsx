import React from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Flight } from 'real-time-flight-lib'

// export type Flight = {
//     id: string,
//     callSign: string,
//     airline: string,
//     origin: {
//         airport: string,
//         city: string,
//         country: string,
//         weather: string
//     },
//     destination: {
//         airport: string,
//         city: string,
//         country: string,
//         weather: string
//     },
//     actualTime: {
//         departureTime: number,
//         arrivalTime: number
//     },
//     scheduledTime: {
//         departureTime: number,
//         arrivalTime: number
//     },
//     distance: number,
//     trail: [
//         {
//             latitude: number,
//             longitude: number,
//             altitude: number,
//             speed: number,
//             head: number
//         }
//     ]
// }

export type prediction = {
    [id: string]: string
}

type FlightRow = {
    number: string,
    isOnTime: string,
    fromWhere: string,
}

const columnHelper = createColumnHelper<FlightRow>();

const columns = [
    columnHelper.accessor(row => row.number, {
        id: 'number',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Flight Number</span>,
    }),
    columnHelper.accessor('isOnTime', {
        header: () => 'Status',
        cell: info => info.renderValue(),
    }),
    columnHelper.accessor('fromWhere', {
        header: () => 'From/To',
        cell: info => info.renderValue(),
    }),
]

/* React component where show/hide
  functionality is implemented */
export const FlightsTable = (props: {flights: Flight[], predictions: prediction}) => {
    let Flights = props.flights;
    let filteredData: FlightRow[] = [];

    // debugger;

    Flights.forEach(flight => {
        let row: FlightRow = {
            number: flight.callSign,
            isOnTime: props.predictions ? props.predictions[flight.id] : 'אין חיזוי כרגע',
            fromWhere: flight.destination.airport === 'TLV' ? flight.origin.airport : flight.destination.airport,
        };
        filteredData.push(row);
    });

    const [data, setData] = React.useState(() => [...filteredData])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="default-container">
            <table className="styled-table">
                <thead className="t-head">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr className="active-row" key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="t-body">
                {table.getRowModel().rows.map(row => (
                    <tr className="active-row" key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}