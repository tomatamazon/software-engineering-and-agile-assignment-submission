import {Alert, Button, Form} from "react-bootstrap";
import React, {useState} from "react";

async function postCreateTicket(ticketTitle, ticketDescription, ticketAssignee, ticketProgressEstimate) {
    const response = await fetch("/post_data", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "title": ticketTitle, "description": ticketDescription, "assignee": ticketAssignee,
            "progress_estimate": ticketProgressEstimate })
    });
    const data = await response.json();
    return data.status;
}

function CreateTicket(props) {

    const [ticketTitle, setTicketTitle] = useState("");
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketAssignee, setTicketAssignee] = useState("");
    const [ticketProgressEstimate, setTicketProgressEstimate] = useState("");
    const [ticketProgressInvalidSelection, setTicketProgressInvalidSelection] = useState(false);
    const [ticketError, setTicketError] = useState(false);

    const returnToLandingPage = () => {
        props.setCreateTicketState(false);
    }

    const handleTicketTitle = (event) => {
        setTicketTitle(event.target.value);
    };

    const handleTicketDescription = (event) => {
        setTicketDescription(event.target.value);
    };

    const handleTicketAssignee = (event) => {
        setTicketAssignee(event.target.value);
    };

    const handleTicketProgressEstimate = (event) => {
        setTicketProgressEstimate(event.target.value);
    };

    const handleCreateTicketEvent = async () => {
        if (ticketTitle === "" || ticketDescription === "" || ticketAssignee === "") {
            setTicketError(true);
            setTicketProgressInvalidSelection(false);
        } else if (ticketProgressEstimate === "" || ticketProgressEstimate === "1") {
            setTicketError(false);
            setTicketProgressInvalidSelection(true);
        } else {
            setTicketError(false);
            setTicketProgressInvalidSelection(false);

            const databasePostStatus = await postCreateTicket(ticketTitle, ticketDescription, ticketAssignee, ticketProgressEstimate);
            if (databasePostStatus === "success") {
                props.setCreateTicketState(false);
                props.setCreateTicketSuccessState(true);
            } else {
                props.setCreateTicketState(false);
                props.setCreateTicketFailureState(true);
            }
        }
    }

    return(
        <div>
            <div className="create-ticket-parent">
                <div className="return-to-landing-page">
                    <Button variant="danger" onClick={returnToLandingPage}>Exit without saving</Button>
                </div>
                <div className="create-ticket-title">
                    <label>
                        Title:
                        <Form.Control style={{ 'width': '800px' }} placeholder="Describe your ticket..."
                                      onChange={handleTicketTitle} />
                    </label>
                </div>
                <div className="create-ticket-description">
                    <label>
                        Description:
                        <Form.Control as="textarea" rows={3} style={{ 'width': '800px' }}
                                      onChange={handleTicketDescription} />
                    </label>
                </div>
                <div className="create-ticket-assignee">
                    <label>
                        Assignee:
                        <Form.Control style={{ 'width': '50%' }} onChange={handleTicketAssignee} />
                    </label>
                </div>
                <div className="create-ticket-progress-estimate">
                    <label>
                        Progress Estimate (in days):
                        <Form.Select style={{ 'width': '88%' }} onChange={handleTicketProgressEstimate}>
                            <option value="1">Select an option</option>
                            <option value="2">1</option>
                            <option value="3">2</option>
                            <option value="4">3</option>
                            <option value="5">4</option>
                            <option value="6">5</option>
                            <option value="7">6</option>
                            <option value="8">7</option>
                            <option value="9">8</option>
                            <option value="10">9</option>
                            <option value="11">10</option>
                        </Form.Select>
                    </label>
                </div>
                <div className="create-ticket-button" onClick={handleCreateTicketEvent}>
                    <Button variant='info'>
                        Create ticket
                    </Button>
                </div>
                { ticketError ? <Alert className='create-ticket-error-alert' variant={'danger'} style={{ color: 'red' }}>
                    Please fill all the inputs
                </Alert>
                    : null }
                { ticketProgressInvalidSelection ? <Alert className='create-ticket-invalid-selection-alert'
                                                          variant={'danger'} style={{ color: 'red' }}>
                    Invalid progress estimate choice
                </Alert>
                    : null }
            </div>
        </div>
    );
}

export default CreateTicket;