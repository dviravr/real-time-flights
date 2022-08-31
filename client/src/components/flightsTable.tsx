import React from "react";

/* React component where show/hide
  functionality is implemented */
export const FlightsTable = () => {
    return (
        <div className="default-container">
            <table className="styled-table">
                <tr>
                    <th>Flight</th>
                    <th>Status</th>
                </tr>
                <tr className="active-row">
                    <td>No. AB-123</td>
                    <td>On Time</td>
                </tr>
                <tr className="active-row">
                    <td>No. AB-123</td>
                    <td>On Time</td>
                </tr>
            </table>
        </div>
    );
}