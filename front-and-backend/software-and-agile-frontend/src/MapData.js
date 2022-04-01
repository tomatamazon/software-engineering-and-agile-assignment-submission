import React, {useState} from 'react';
import {Accordion, Alert, Button, Form} from "react-bootstrap";

async function updateEntry(id, title, description, assignee, progressActual, resolved) {
    const response = await fetch("/update_entry", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": id, "title": title, "description": description, "assignee": assignee,
            "progress_actual": progressActual, "resolved": resolved })
    });
    const data = await response.json();
    return data.entry_update_status
}

async function deleteEntry(id) {
    const response = await fetch("/delete_entry", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": id })
    })
    const data = await response.json();
    return data.delete_entry_status
}

function MapData(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");
    const [progressActual, setProgressActual] = useState("");
    // props.resolved is 0 if false and 1 if true.
    const [resolved, setResolved] = useState(false);
    const [propsResolvedTemp, setPropsResolvedTemp] = useState(false);
    const [updateTicketFailureState, setUpdateTicketFailureState] = useState(false);

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleChangeAssignee = (event) => {
        setAssignee(event.target.value);
    }

    const handleChangeProgressActual = (event) => {
        setProgressActual(event.target.value);
    }

    const handleChangeResolved = (event) => {
        if (event.target.value === "on") {
            setResolved(true);
        } else {
            setResolved(false);
        }
    }

    const handleUpdateTicket = async () => {
        if (props.resolved === 0) {
            setPropsResolvedTemp(false);
        } else if (props.resolved === 1) {
            setPropsResolvedTemp(true);
        } else {
            setPropsResolvedTemp(false);
        }

        if (title === "" && description === "" && assignee === "" && progressActual === "" && resolved === propsResolvedTemp) {
            // Nothing has been changed. Show a warning saying this.
            setUpdateTicketFailureState(true);
        } else if (title !== "" || description !== "" || assignee !== "" || progressActual !== "" || resolved !== propsResolvedTemp) {
            // An update has been made.
            const id = props.id
            const data = await updateEntry(id, title, description, assignee, progressActual, resolved);

            if (data === "success") {
                props.setLoadButtonState(false);
                props.setLoadMapDataState(false);
                props.setShowTicketUpdateSuccess(true);
            } else {
                props.setLoadButtonState(false);
                props.setLoadMapDataState(false);
                props.setShowTicketUpdateFailure(true);
            }
        }
    }

    const handleDeleteTicket = async () => {
        const id = props.id
        const data = await deleteEntry(id)

        if (data === "success") {
            props.setLoadButtonState(false);
            props.setLoadMapDataState(false);
            props.setShowTicketDeleteSuccess(true);
        } else {
            props.setLoadButtonState(false);
            props.setLoadMapDataState(false);
            props.setShowTicketDeleteFailure(true);
        }
    }

    return (
        <div className="map-items">
            <div class="accordion">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey={props.id}>
                        <Accordion.Header>{props.title}</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Control style={{ 'width': '50%' }} placeholder={"Title: " + props.title}
                                                  onChange={handleChangeTitle} />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <Form.Control style={{ 'width': '50%' }} as="textarea" rows={3}
                                                  placeholder={"Description: " + props.description}
                                                  onChange={handleChangeDescription} />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <Form.Control style={{ 'width': '25%' }} placeholder={"Assignee: " + props.assignee}
                                                  onChange={handleChangeAssignee} />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <Form.Control style={{ 'width': '25%' }} disabled
                                                  placeholder={"Progress estimate: " + props.progress_estimate} />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <Form.Select style={{ 'width': '25%' }} onChange={handleChangeProgressActual}>
                                        <option value="1">{"Progress actual: " + props.progress_actual}</option>
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
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <div className="format-resolved">
                                        <Form.Check type="checkbox" defaultChecked={props.resolved}
                                                    onChange={handleChangeResolved} label="Resolved" />
                                    </div>
                                </Form.Group>
                            </Form>
                        </Accordion.Body>

                        <div className="item-update">
                            {/*Delete should only be available to admin users*/}
                            {props.accessLevel === "admin" ?
                                <div>
                                    <Accordion.Body>
                                        <Button variant="danger" onClick={handleDeleteTicket}>Delete</Button>
                                    </Accordion.Body>
                                </div>
                                : null
                            }
                            <Accordion.Body>
                                <Button variant="success" onClick={handleUpdateTicket}>Update</Button>
                            </Accordion.Body>
                        </div>
                        <div>
                            {updateTicketFailureState === true ?
                                <Alert variant={'danger'} style={{ color: 'red' }}>
                                    No fields have changed. You cannot update this ticket until you change at least one of the fields.
                                </Alert>
                                : null
                            }
                        </div>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    )
}

export default MapData;