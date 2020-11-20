import React from 'react';
import blue_helm2 from "../Images/blue_helm2.png"


function Response(props){
    return(
        <div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
  <title>OrgBoat</title>
  {/* Favicon */}
  <link rel="icon" href="../../sl/dist/media/img/favicon.png" type="image/png" />
  {/* Bundle Styles */}
  <link rel="stylesheet" href="../../sl/vendor/bundle.css" />
  {/* App styles */}
  <link rel="stylesheet" href="../../sl/dist/css/app.min.css" />
  <div className="form-wrapper">
    {/* logo */}
    <div className="logo">
      <a href="/">  <img src={blue_helm2} width={55} height alt="Blue Helm" /> </a>
    </div>
    {/* ./ logo */}
    <h5>{props.msg2}</h5>
    <p style={{fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif', boxSizing: 'border-box', fontSize: 14, verticalAlign: 'top', margin: 0, padding: '10px 10px'}} valign="top">{props.msg}</p>
    <div className="form-group">
      &lt;% if(opt2 === "Email Verified" || opt2 === "Password Changed"){'{'} %&gt;
      <a href="/">Log In</a>
      &lt;%{'}'}else if(opt2 === "Sent Successfully"){'{'}%&gt;
      <p> Thank you!</p>
      &lt;% {'}'}else {'{'}%&gt;
      <a href="javascript:history.back()">Go Back</a>
      &lt;% {'}'}%&gt;
    </div>
    <hr />
    <p className="text-muted">Take a different action.</p>
    <a href="/subscribe" className="btn btn-sm btn-outline-light mr-1">Subscribe!</a>
    or
    <a href="/" className="btn btn-sm btn-outline-light ml-1">Login!</a>
    %&gt;
  </div>
  {/* Bundle */}
  {/* App scripts */}
</div>

    )
}

export default Response;