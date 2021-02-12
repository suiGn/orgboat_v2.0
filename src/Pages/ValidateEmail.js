import React, { useEffect, useState } from "react";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";
import axios from "axios";

function ValidateEmail() {
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [validateMail, setValidateMail] = useState(0);
  useEffect(() => {
    const url = require('url').parse(window.location.href, true);
    let em = url.query.em?url.query.em:""
    let uuid = url.query.uuid?url.query.uuid:""
    if(em!=""&&uuid!=""){
      setOpt1("Verifying Email.")
      setOpt2("Please wait.")
      let user = {
        em: em,
        uuid: uuid,
      };
      axios.post("/verMail", user).then((res) => {
        setOpt1(res.data.opt1)
        setOpt2(res.data.opt2)
        setValidateMail(1)
      });
    }else{
      setOpt1("Email Verification Required.")
      setOpt2("Please check your email to verify it.")
      setValidateMail(2)
    }
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
          {validateMail==0?
            <div className="form-group">
            </div>:
            validateMail==1?
            <div className="form-group">
              <br />
              <a href="/">Sign In.</a>
            </div>:
            <div className="form-group">
            <a href="/resnd?uuid=<%=usr.u_id%>&em=<%=usr.email%>">
              Re-send Verification Link.
            </a>
            <br />
            <a href="/sign-in">Sign In.</a>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default ValidateEmail;
