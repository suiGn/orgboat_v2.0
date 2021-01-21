import React, { useState, useEffect } from "react";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000/subscribe";

function SignUp() {
  const [response, setResponse] = useState("");
  useEffect(() => document.body.classList.add("form-membership"), []);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("subData", (data) => {
      setResponse(data);
    });
    socket.emit("subscribingData", (data, value) => {
      JSON.stringify({ value: value, code: data });
    });
  }, []);

  return (
    <div className="form-wrapper">
      <div className="logo">
        <Logo />
      </div>
      <h5>Create account</h5>
      <form
        action="http://localhost:5000/subscribing"
        method="post"
        name="subForm"
        onsubmit="return validateForm()"
      >
        <div className="form-group">
          <input
            type="text"
            name="subName"
            className="form-control"
            placeholder="Firstname"
            maxLength={21}
            onchange="validData('vName', this.value)"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="subUsername"
            placeholder="Username"
            required
            onchange="validData('vUser', this.value)"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="subEmail"
            maxLength={34}
            onchange="validData('vEmail', this.value)"
            className="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="subPwd"
            className="form-control"
            placeholder="Password"
            maxLength={21}
            required
          />
        </div>
        <button className="btn btn-primary btn-block">Register</button>
        <hr />
        <p className="text-muted">Already have an account?</p>
        <a href="/sign-in" className="btn btn-outline-light btn-sm">
          Sign in!
        </a>
      </form>
    </div>
  );
}

export default SignUp;
