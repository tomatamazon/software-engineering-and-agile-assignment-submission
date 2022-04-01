import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';

function App() {

  const [accessLevel, setAccessLevel] = useState("");

  if (accessLevel === "" || accessLevel === "invalid") {
    return (<LoginPage setAccessLevel={setAccessLevel} />);
  } else {
    return (<LandingPage accessLevel={accessLevel} setAccessLevel={setAccessLevel} />);
  }
}

// Next steps:
//
// 1. Refactor the code and implement consistency with good programming practices X
//
// 2. Fill out Task 1 (with a brief description/explanation of the application with instructions on how to use).
//
// 3. Reword Task 2. Explain the agile (Scrum) practices that I used when developing this task. Use evidence to support
//    this (i.e. Screenshots of the sprint board).
//
// 4. Gather evidence for documentation (Screenshot of Draft website, 3 different website pages, database with sample
//    data, data that I've used for testing).
//
// 5. Deploy the work to GitHub
//
// 6. Deploy the website to an external endpoint that can be accessed by computers that aren't mine. Test that different
//    computers can access the database.

export default App;