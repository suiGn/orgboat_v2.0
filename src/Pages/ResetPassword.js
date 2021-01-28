import React, { useEffect, useState } from "react";
// import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";

function ResetPassword() {
  useEffect(() => document.body.classList.add("form-membership"), []);
  const [rstEmail, setMail] = useState("");
  const [submit, setSubmit] = useState(false);
  const [ok, setOk] = useState(false);
  const [msg, setMesage] = useState("");
  const [msg2, setMsg2] = useState("");
  function handleChange(e) {
    setMail(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSubmit(true);
    if (!rstEmail) {
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rstEmail }),
    };
    (async () => {
      const response = await fetch("/rstpwd", requestOptions);
      const data = await response.json();
      setOk(data.ok);
      console.log(data.ok);
      if (data.ok) {
        setMesage("Please check your inbox to reset your password");
        console.log(msg);
        //return(<Response mgs="Please check your inbox to reset your password" msg2 ="Sent Successfully"/>)
      } else {
        //return(<Response mgs="Please try again." msg2 ="Error"/>)
      }
    })();
  }
  return (
    <div className="form-wrapper">
      <div className="logo">
        <Logo />
      </div>
      <h5>Reset password</h5>
      <form name="reset" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Username or email"
            required
            autoFocus
            name="rstEmail"
            value={rstEmail}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary btn-block">Submit</button>
        <hr />
        <p className="text-muted">Take a different action.</p>
        <a href="/sign-up" className="btn btn-sm btn-outline-light mr-1">
          Register now!
        </a>
        or
        <a href="/sign-in" className="btn btn-sm btn-outline-light ml-1">
          Login!
        </a>
      </form>
    </div>
  );
}

export default ResetPassword;
