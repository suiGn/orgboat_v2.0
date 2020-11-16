import React  from "react";
import blue_helm2 from "../Images/blue_helm2.png"

function ResetPass (props){
    return(
        <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>OrgBoat Reset Password</title>
        <div className="form-wrapper">
          {/* logo */}
          <div className="logo">
            <a href="/">  <img src={blue_helm2} width={55} height alt="Blue Helm" /> </a>
          </div>
          {/* ./ logo */}
          <h5>Reset password</h5>
          {/* form */}
          <form method="post" action="/rstpwd">
            <div className="form-group">
              <input type="text" className="form-control" name="rstEmail" placeholder="E-mail" required autofocus />
            </div>
            <button className="btn btn-primary btn-block">Submit</button>
            <hr />
            <p className="text-muted">Take a different action.</p>
            <a href="/signup" className="btn btn-sm btn-outline-light mr-1">Subscribe!</a>
            or
            <a href="/" className="btn btn-sm btn-outline-light ml-1">Login!</a>
          </form>
          {/* ./ form */}
        </div>
        {/* Bundle */}
        {/* App scripts */}
      </div>      
    )
}

export default ResetPass;