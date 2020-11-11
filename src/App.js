import React from "react";
import logo from "./Images/logo.png";
import Login from "./components/Login.js";
import Workspace from "./components/Workspace.js";
import SignUp from "./components/SignUp.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} isBadLogin={''}/>
        <Route path="/badLogin" render={(props) => (<Login isBadLogin={'Invalid Username or Password'} />)} />
        <Route path="/workspace" component={Workspace} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </Router>
  );
}

export default App;
