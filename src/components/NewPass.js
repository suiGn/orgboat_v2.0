import React from 'react';
import blue_helm2 from "../Images/blue_helm2.png"


function NewPass (props){
    
    return(
        <div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
  <title>Choose New Password</title>
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
    <h5>Choose New Password</h5>
    <p className="content-block" style={{fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif', boxSizing: 'border-box', color: '#3f5db3', fontSize: 14, verticalAlign: 'top', margin: 0, padding: '10px 10px'}} valign="top">&lt;%= opt %&gt;</p><p>
      {/* form */}
    </p><form method="post" action="/resetPwd">
      <div className="form-group">
        <input type="password" style={{display: 'none'}} name="uuid" defaultValue="<%= opt1 %>" />
        <input type="password" style={{display: 'none'}} name="email" defaultValue="<%= opt %>" />
        <input type="password" className="form-control" name="password" placeholder="Choose New Password." required autofocus />
        <input type="password" className="form-control" name="rtpass" placeholder="Re-type New Password." required autofocus />
      </div>
      <button className="btn btn-primary btn-block">Submit</button>
      <hr />
      <p className="text-muted">Take a different action.</p>
      <a href="/subscribe" className="btn btn-sm btn-outline-light mr-1">Subscribe!</a>
      or
      <a href="/" className="btn btn-sm btn-outline-light ml-1">Login!</a>
    </form>
    {/* ./ form */}
  </div>
  {/* Bundle */}
  {/* App scripts */}
</div>

    );
}

export default NewPass;