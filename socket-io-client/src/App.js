import React from "react";
import logo from "./Images/logo.png";
import Login from './components/Login.js'
import Workspace from './components/Workspace.js'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/workspace" component={Workspace}/>
      </Switch>
    </Router>

  );
}

export default App;
