import React, { useState, useEffect } from "react";
import NavLogin from "./NavLogin";
import light from "../Images/mesure_2.png";
import lighthouse from "../Images/tour_measure1.png";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000/subscribe";

function SignUp() {
  const [response, setResponse] = useState("");
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
    <div className="body-8">
      <NavLogin login={'signup'}/>
      <div className="sign-up-div-2">
        <h1 className="fingertipsslogan-2 login-head-form reg">SIGN UP</h1>
        <div className="w-form">
          <form
            id="email-form-3"
            name="subForm"
            data-name="Subscribe Form"
            className="form-register-2"
            action="http://localhost:5000/subscribing"
            method="post"
            onsubmit="return validateForm()"
          >
            <label className="form-label" id="#labelName" />
            <input
              type="text"
              id="inputName"
              name="subName"
              placeholder="Full Name"
              maxLength={21}
              className="start-form-2 w-input"
              onchange="validData('vName', this.value)"
              required
            />
            <label className="form-label" id="labelEmail" />
            <input
              type="text"
              id="inputEmail"
              name="subEmail"
              placeholder="E-mail"
              maxLength={34}
              className="start-form-2 w-input"
              onchange="validData('vEmail', this.value)"
              required
            />
            <label className="form-label" id="labelUsername" />
            <input
              type="text"
              id="inputUsername"
              name="subUsername"
              placeholder="Username"
              maxLength={11}
              className="start-form-2 w-input"
              onchange="validData('vUser', this.value)"
              required
            />
            <label className="form-label" />
            <input
              type="password"
              id="pwd-2"
              name="subPwd"
              placeholder="Password"
              maxLength={21}
              className="start-form-2 w-input"
              required
            />
            <label className="form-label" />
            <input
              type="password"
              id="pwd-3"
              name="subRtPwd"
              placeholder="Re-type Password"
              maxLength={21}
              className="start-form-2 w-input"
              required
            />
            {/* <label className="form-label" id="labelUsername">
              &lt;%= opt %&gt;
            </label> */}
            <div className="login-form-footer-2">
              By registering you are agreeing to our terms and conditions.
            </div>
            <input
              type="submit"
              defaultValue="Register"
              data-wait="Please wait..."
              className="button w-button"
            />
          </form>
          <div className="w-form-done">
            <div>Thank you! Your submission has been received!</div>
          </div>
        </div>
        <img src="w/imgs/nat_logo.png" width={55} alt className="img-neurons" />
        <div className="login-form-footer-2 foot2">
          <a href="#" className="login-form-footer-2 footer2">
            By Neurons Art &amp; Technology
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
