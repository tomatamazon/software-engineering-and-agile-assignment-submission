import React, {useState} from "react";
import {Alert, Button, Card} from "react-bootstrap";
import MapData from './MapData';

async function getData() {
    const response = await fetch("/get_entries", {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data.data;
}

function ShowData(props) {

    const [databaseResponse, setDatabaseResponse] = useState("");
    const [showLoadButtonState, setShowLoadButtonState] = useState(false);
    const [loadMapDataState, setLoadMapDataState] = useState(false);
    const [allDatabaseEntries, setAllDatabaseEntries] = useState([]);
    const [showTicketUpdateSuccess, setShowTicketUpdateSuccess] = useState(false);
    const [showTicketUpdateFailure, setShowTicketUpdateFailure] = useState(false);
    const [showTicketDeleteSuccess, setShowTicketDeleteSuccess] = useState(false);
    const [showTicketDeleteFailure, setShowTicketDeleteFailure] = useState(false);
    const [noDatabaseEntries, setNoDatabaseEntries] = useState(false);

    const getDataFunc = async () => {
        const data = getData()
        setDatabaseResponse(await data)

        setShowLoadButtonState(true)
        return databaseResponse
    }

    const mapEntries = () => {
        const responsesArray = []
        const allocateAllDatabaseEntries = []

        // Display special message if there are no entries inside the database.
        if (databaseResponse === "0") {
            return setNoDatabaseEntries(true);
        }

        let count = 0
        for (const entry in databaseResponse) {
            count = count + 1
            // Maps all database entries. To access a specific entry, use responsesArray[x].
            responsesArray[count] = {"id": databaseResponse[entry]["id"], "title": databaseResponse[entry]["title"],
                "description": databaseResponse[entry]["description"], "assignee": databaseResponse[entry]["assignee"],
                "progress_estimate": databaseResponse[entry]["progress_estimate"],
                "progress_actual": databaseResponse[entry]["progress_actual"],
                "resolved": databaseResponse[entry]["resolved"]}
            allocateAllDatabaseEntries.push(responsesArray[count])
        }
        setAllDatabaseEntries(allocateAllDatabaseEntries)
        setLoadMapDataState(true);
        return allDatabaseEntries;
    }

    return(
        <div>
            <div className="ticket-update-state">
                {showTicketUpdateSuccess === true ?
                    <div>
                        <Alert show={showTicketUpdateSuccess} onClose={() => setShowTicketUpdateSuccess(false)}
                               dismissible variant="success">
                            <p>Ticket updated successfully!</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
            <div className="ticket-update-state">
                {showTicketUpdateFailure === true ?
                    <div>
                        <Alert show={showTicketUpdateFailure} onClose={() => setShowTicketUpdateFailure(false)}
                               dismissible variant="warning">
                            <p>Failed to update ticket! Please refresh the page and try again.</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
            <div className="ticket-delete-state">
                {showTicketDeleteSuccess === true ?
                    <div>
                        <Alert show={showTicketDeleteSuccess} onClose={() => setShowTicketDeleteSuccess(false)}
                               dismissible variant="success">
                            <p>Ticket deleted successfully!</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
            <div className="ticket-delete-state">
                {showTicketDeleteFailure === true ?
                    <div>
                        <Alert show={showTicketDeleteFailure} onClose={() => setShowTicketDeleteFailure(false)}
                               dismissible variant="success">
                            <p>Failed to delete ticket! Please refresh the page and try again.</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
            <div>
                {showLoadButtonState === false ?
                    <Button onClick={getDataFunc} variant="secondary" >Click to load data</Button>
                    : <Button onClick={mapEntries} variant="success" >Click to show data</Button>
                }
            </div>
            <br/>
            <div>
                {noDatabaseEntries === false ?
                    <div>
                        {loadMapDataState === true ?
                            allDatabaseEntries.map((entry) => <MapData showTicketDeleteSuccess={showTicketDeleteSuccess}
                                                                       setShowTicketDeleteSuccess={setShowTicketDeleteSuccess}
                                                                       showTicketDeleteFailure={showTicketDeleteFailure}
                                                                       setShowTicketDeleteFailure={setShowTicketDeleteFailure}
                                                                       showLoadButtonState={showLoadButtonState}
                                                                       setLoadButtonState={setShowLoadButtonState}
                                                                       loadMapDataState={loadMapDataState}
                                                                       setLoadMapDataState={setLoadMapDataState}
                                                                       showTicketUpdateSuccess={showTicketUpdateSuccess}
                                                                       setShowTicketUpdateSuccess={setShowTicketUpdateSuccess}
                                                                       showTicketUpdateFailure={showTicketUpdateFailure}
                                                                       setShowTicketUpdateFailure={setShowTicketUpdateFailure}
                                                                       accessLevel={props.accessLevel}
                                                                       setAccessLevel={props.setAccessLevel}
                                                                       id={entry.id} title={entry.title}
                                                                       description={entry.description}
                                                                       assignee={entry.assignee}
                                                                       progress_estimate={entry.progress_estimate}
                                                                       progress_actual={entry.progress_actual}
                                                                       resolved={entry.resolved} />)
                            : null
                        }
                    </div>
                    : <Card style={{ 'text-align': 'centre' }}>
                        <Card.Body>
                            There are no entries in the database.
                        </Card.Body>
                    </Card>
                }
            </div>
        </div>
    )
}

export default ShowData;