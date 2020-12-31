import React, { useState, useEffect } from "react";
function verifyEmail(){
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
            <a href="/">  <img src="media/imgs/blue_helm2.png" width={55} height alt="Blue Helm" /> </a>
            </div>
            {/* ./ logo */}
            <h5>Email Verification Required.</h5>
            <p style={{fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif', boxSizing: 'border-box', fontSize: 14, verticalAlign: 'top', margin: 0, padding: '10px 10px'}} valign="top">Please check your email to verify it.</p>
            <div className="form-group">
            <a href="/resnd?uuid=<%=usr.u_id%>&em=<%=usr.email%>">Re-send Verification Link.</a><br />
            <a href="/logout">Log Out.</a>
            </div>
        </div>
        {/* Bundle */}
        {/* App scripts */}
        </div>
    )
}
