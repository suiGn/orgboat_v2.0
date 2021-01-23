import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ValidateEmail from "./Pages/ValidateEmail";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import LockScreen from "./Pages/LockScreen";
import ResetPassword from "./Pages/ResetPassword";
import PhoneCode from "./Pages/PhoneCode";
import Layout from "./App/Layout";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000/";
const socket = io({
  transports: ["websocket"],
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    // background: "black",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  colorPrimary: {
    color: "#f5af19",
  },
}));

function App() {
  const [loggedIn, setloggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [darkSwitcherTooltipOpen, setDarkSwitcherTooltipOpen] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    console.log("mounted");
    CheckIfLogged();
    // (async () => {
    //   const response = await fetch("/logged");
    //   const data = await response.json();
    //   setloggedIn(data.ok);
    //   console.log(data.ok);
    // })();
  }, []);

  const CheckIfLogged = () => {
    axios
      .get("/logged", {
        onDownloadProgress: (progressEvent) => {
          console.log(progressEvent);
          const total = parseFloat(progressEvent.total);
          const current = progressEvent.loaded;

          setProgress(Math.floor((current / total) * 100));
          console.log("completed: ", progress);
        },
      })
      .then((res) => {
        if (res.data.ok) {
          UpdateTheme.then(() => {
            setLoaded(true);
          });
        } else {
          setLoaded(true);
        }

        setloggedIn(res.data.ok);
      });
  };
  console.log(loggedIn);

  const UpdateTheme = new Promise((resolve, reject) => {
    socket.emit("theme");
    socket.on("retrive theme", function (theme) {
      console.log(theme);
      if (theme.theme[0].theme === 0) {
        document.body.className = "";
      } else {
        document.body.className = "dark";
      }
      resolve(true);
    });
  });

  if (!loaded) {
    return (
      <div className={classes.root}>
        <CircularProgress
          className={classes.colorPrimary}
          variant="determinate"
          size={100}
          value={progress}
        />
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/workspace" /> : <SignIn isBadLogin={""} />}
        </Route>
        <Route path="/sign-in">
          {loggedIn ? <Redirect to="/workspace" /> : <SignIn isBadLogin={""} />}
        </Route>
        <Route path="/workspace">
          {loggedIn ? (
            <Layout
              darkSwitcherTooltipOpen={darkSwitcherTooltipOpen}
              setDarkSwitcherTooltipOpen={setDarkSwitcherTooltipOpen}
              socket={socket}
            />
          ) : (
            <SignIn isBadLogin={""} />
          )}
        </Route>
        <Route
          path="/badLogin"
          render={(props) => (
            <SignIn isBadLogin={"Invalid Username or Password"} />
          )}
        />
        <Route path="/verify-email" component={ValidateEmail} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/lock-screen" component={LockScreen} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/phone-code" component={PhoneCode} />
        <Route render={() => <h2>404 not found</h2>} />
      </Switch>
    </Router>
  );
}

export default App;
