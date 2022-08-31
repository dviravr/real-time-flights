export const SidePanel = () => {
    return(
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
            <div className="side-bar-item" style={{display: "flex", flexDirection: "column"}}>
                <h2 style={{borderStyle: "solid", margin: "0px"}}> Incoming flights </h2>
                <p> 3 </p>
            </div>
            <div className="side-bar-item" style={{display: "flex", flexDirection: "column"}}>
                <h2 style={{borderStyle: "solid", margin: "0px"}}> Outgoing flights </h2>
                <table>
                    scrollable table with outgoing flights
                </table>
            </div>
            <div className="side-bar-item" style={{display: "flex", flexDirection: "column"}}>
                Weather Widget
            </div>
        </div>
    )
}