import React, { useEffect, useState } from "react";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";
import axios from "axios";

function ValidateEmail() {
  const [opt1, setOpt1] = useState("Verifying Email.");
  const [opt2, setOpt2] = useState("Please wait.");
  useEffect(() => {
    const url = require('url').parse(window.location.href, true);
    let em = url.query.em
    let uuid = url.query.uuid
    let user = {
      em: em,
      uuid: uuid,
    };
    axios.post("/verMail", user).then((res) => {
      setOpt1(res.data.opt1)
      setOpt2(res.data.opt2)
    });
    document.body.classList.add("form-membership")
  }
  ,[]);
  return (
    <div>
      {
        <div className="form-wrapper">
          <div className="logo">
            <Logo />
          </div>
          <h5>{opt1}</h5>
          <p
            style={{
              fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
              boxSizing: "border-box",
              fontSize: 14,
              verticalAlign: "top",
              margin: 0,
              padding: "10px 10px",
            }}
            valign="top"
          >
          {opt2}
          </p>
          <div className="form-group">
            <br />
            <a href="/">Sign In.</a>
          </div>
        </div>
        /*<div className="form-wrapper">
          <div className="logo">
            <Logo />
          </div>
          <h5>Email Verification Required.</h5>
          <p
            style={{
              fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
              boxSizing: "border-box",
              fontSize: 14,
              verticalAlign: "top",
              margin: 0,
              padding: "10px 10px",
            }}
            valign="top"
          >
            Please check your email to verify it.
          </p>
          <div className="form-group">
            <a href="/resnd?uuid=<%=usr.u_id%>&em=<%=usr.email%>">
              Re-send Verification Link.
            </a>
            <br />
            <a href="/sign-in">Sign In.</a>
          </div>
        </div>*/
      }
    </div>
  );
}

export default ValidateEmail;
