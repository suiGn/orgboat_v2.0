import React, { useState, useEffect } from "react";
import logo from "./Images/logo.png";
import Login from "./components/Login.js";
import Workspace from "./components/Workspace.js";
import SignUp from "./components/SignUp.js";
import ResetPass from "./components/reset-pass";
import  successEmail from "./components/success-email"; 
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  const [loggedIn, setloggedIn] = useState(false);
  const [load, setLoad] = useState(false);

  function fakeRequest() {
    return new Promise((resolve) => setTimeout(() => resolve(), 2000));
  }

  useEffect(() => {
    fakeRequest().then(() => {
      setLoad(true);
    });
    console.log("mounted");

    (async () => {
      const response = await fetch("/logged");
      const data = await response.json();
      setloggedIn(data.ok);
      console.log(data.ok);
    })();
  }, []);
  return (
    <Router>
      <div
        style={{ display: load == false ? "flex" : "none" }}
        class="loader-container"
      >
        <div class="loader"></div>
      </div>
      <Switch>
        <Route exact path="/">
          {loggedIn ? (
            <Redirect to="/workspace" />
          ) : (
            <Login load={load} isBadLogin={""} />
          )}
        </Route>
        <Route
          path="/badLogin"
          render={(props) => (
            <Login isBadLogin={"Invalid Username or Password"} />
          )}
        />
        <Route path="/workspace">
          {loggedIn ? (
            <Workspace setloggedIn={setloggedIn} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/signup" component={SignUp} />
        <Route path="/reset-pwd" component={ResetPass} />
        <Route path="/response" component={ResetPass} />
        <Route path="/success" component={successEmail} />
      </Switch>
    </Router>
  );
}

export default App;
