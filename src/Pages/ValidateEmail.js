import React, { useEffect, useState } from "react";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";

function ValidateEmail() {
  useEffect(() => document.body.classList.add("form-membership"), []);
  return (
    <div>
      <div className="form-wrapper">
        <div className="logo">
          <Logo />
        </div>
        <h5>Email Verification Required.</h5>
        <p className="text-muted">Please check your email to verify it.</p>
        <a href="/sign-up" className="btn btn-sm btn-outline-light mr-1">
          Re-send Verification Link.
        </a>
        or
        <a href="/sign-in" className="btn btn-sm btn-outline-light ml-1">
          Login!
        </a>
        {/* <p
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
        </div> */}
      </div>
    </div>
  );
}

export default ValidateEmail;
