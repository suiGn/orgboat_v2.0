import React, { useState, useEffect } from "react";
import axios from "axios";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";
import socketIOClient from "socket.io-client";

function SignUp() {
  const [response, setResponse] = useState("");
  const [username,setUsername] =  useState("");
  const [fullname,setFullname] =  useState("");
  const [email,setEmail] =  useState("");
  const [pwrd,setPwrd] =  useState("");
  const [pwrd2,setPwrd2] =  useState("");
  useEffect(() => document.body.classList.add("form-membership"), []);

  const subscribing = event => {
    event.preventDefault();
    const user = {
      subName:fullname,
      subEmail:email,
      subUsername:username,
      subPwd:pwrd,
      subRtPwd:pwrd2
    }
    axios.post("/subscribing",user).then((res) => {
        console.log(res);
    });

  }
  const handleChangeName = event => {
    setUsername(event.target.value);
  }
  const handleChangeFullname = event => {
    setFullname(event.target.value);
  }
  const handleChangeEmail = event => {
    setEmail(event.target.value);
  }

  const handleChangePwd = event => {
    setPwrd(event.target.value);
  }
  const handleChangePwd2 = event => {
    setPwrd2(event.target.value);
  }

  return (
    <div className="form-wrapper">
      <div className="logo">
        <Logo />
      </div>
      <h5>Create account</h5>
      <form
        action="/subscribing"
        method="post"
        name="subForm"
        // onsubmit={subscribing}
      >
        <div className="form-group">
          <input
            type="text"
            name="subName"
            className="form-control"
            placeholder="Firstname"
            maxLength={21}
            onChange={handleChangeFullname}
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
            onChange={handleChangeName}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="subEmail"
            maxLength={34}
            onChange={handleChangeEmail}
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
            onChange={handleChangePwd}
            maxLength={21}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="subRtPwd"
            className="form-control"
            onChange={handleChangePwd2}
            placeholder="Re-type Password"
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
