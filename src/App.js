import React, { useState, useEffect } from "react";
import logo from "./Images/logo.png";
import Login from "./components/Login.js";
import Workspace from "./components/Workspace.js";
import SignUp from "./components/SignUp.js";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";


function App() {
  const [loggedIn, setloggedIn] = useState(false);
  useEffect(()=>{
    logged();
  },[])
  const logged = async() => {
    const response = await fetch("/logged");
    const data = await response.json();
    setloggedIn(data.ok);
    console.log(data.ok);
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/workspace" /> : <Login isBadLogin={''}/>}
        </Route>
        <Route path="/badLogin" render={(props) => (<Login isBadLogin={'Invalid Username or Password'} />)} />
        <Route path="/workspace" > 
          {loggedIn ? <Workspace /> : <Redirect to="/" />}
        </Route>
        <Route path="/signup" component={SignUp} />
      </Switch>
    </Router>
  );
}


export default App;
