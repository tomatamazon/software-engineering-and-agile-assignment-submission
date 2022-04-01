import { Button, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import CreateTicket from './CreateTicket';
import ShowData from './ShowData';

function LandingPage(props) {

    const [createTicketState, setCreateTicketState] = useState(false);
    const [createTicketSuccessState, setCreateTicketSuccessState] = useState(false);
    const [createTicketFailureState, setCreateTicketFailureState] = useState(false);

    const handleLogout = () => {
        props.setAccessLevel("");
    };

    const createTicket = () => {
        setCreateTicketState(true);
    }

    return(
        <div className='landing-page-parent'>
            <div className="btn-group-parent">
                {createTicketState === false ?
                    <div className='create'>
                        <div className="homepage-parent">
                            <div className="create-ticket">
                                <Button variant="secondary" onClick={createTicket}>Create Ticket</Button>
                            </div>
                            <div className="show-content">
                                <ShowData accessLevel={props.accessLevel} setAccessLevel={props.setAccessLevel} />
                            </div>
                        </div>
                    </div>
                    : <CreateTicket createTicketState={createTicketState} setCreateTicketState={setCreateTicketState}
                                    createTicketSuccessState={createTicketSuccessState}
                                    setCreateTicketSuccessState={setCreateTicketSuccessState}
                                    createTicketFailureState={createTicketFailureState}
                                    setCreateTicketFailureState={setCreateTicketFailureState}/>
                }
                <div className="logout-button">
                    <Button variant="dark" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
            <div className="create-ticket-success-state">
                {createTicketSuccessState === true ?
                    <div>
                        <Alert show={createTicketSuccessState} onClose={() => setCreateTicketSuccessState(false)}
                               dismissible variant="success">
                            <p>Ticket created successfully!</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
            <div className="create-ticket-failure-state">
                {createTicketFailureState === true ?
                    <div>
                        <Alert show={createTicketFailureState} onClose={() => setCreateTicketFailureState(false)}
                               dismissible variant="warning">
                            <p>Ticket failed creation! Please try again.</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
        </div>
    );
}

export default LandingPage;