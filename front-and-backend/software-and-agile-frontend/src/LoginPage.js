import {Alert, Button, Form} from 'react-bootstrap';
import React, {useState} from 'react';

async function getUserPerms(username, password) {
    const response = await fetch("/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "username": username, "password": password })
    });
    const data = await response.json();
    return data.user_type;
}

function LoginPage(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginProblem, setLoginProblem] = useState("");

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        if (username === "" && password === "" || username === "" && password !== "" || username !== "" && password === "") {
            setLoginProblem(true);
        } else {
            const userPerms = await getUserPerms(username, password);
            if (userPerms === "invalid") {
                setLoginProblem(true);
            } else {
                setLoginProblem(false);
                props.setAccessLevel(userPerms);
            }
        }
    };

    return(
        <div className='login-page-parent'>
            <div className='login-textbox'>
                <Form>
                    <Form.Control style={{ 'text-align': 'center', 'margin-bottom': '3px' }} placeholder='username'
                                  onChange={handleUsername} />
                    <Form.Control style={{ 'text-align': 'center' }} placeholder='password' type='password'
                                  onChange={handlePassword} />
                </Form>
            </div>
            <div className='login-button'>
                <Button variant='dark' onClick={handleLogin}>
                    Login
                </Button>
            </div>
            {loginProblem ?
                <Alert className='login-alert' variant={'danger'} style={{ color: 'red' }}>Invalid username or password</Alert>
                : null
            }
        </div>
    );
}

export default LoginPage;