import React from "react";
import '../css/app.css'
import '../css/bundle/bundle.css'
import '../css/orgboat/webflow.css'
import '../css/orgboat/orgboat.webflow.css'
// import '../css/orgboat/normalize.css'


export default class NavLogin extends React.Component{
  render(){
  return (
    <div
      data-collapse="medium"
      data-animation="default"
      data-duration="400"
      data-ix="fade-in-right-scroll-in-2"
      role="banner"
      className="navigation-bar w-nav"
    >
      <div className="w-container">
        <nav role="navigation" className="navigation-menu w-nav-menu">
        {this.props.login == 'signup' ? (
                    <a
                    href="/"
                    className="navigation-link login w-nav-link"
                  >
                    Login
                  </a>
                ) : (
                  <a
                    href="/signup"
                    className="navigation-link login w-nav-link"
                  >
                    Sign Up
                  </a>
                )}
          <a
            href="#"
            className="navigation-link w-nav-link" 
          >
            Help
          </a>
        </nav>
        <div className="hamburger-button w-nav-button">
          <div className="w-icon-nav-menu"></div>
        </div>
        <a href="/" className="w-inline-block w--current">
          <img
            src="https://daks2k3a4ib2z.cloudfront.net/598ce9c622e8860001aedbf2/598ce9c622e8860001aedcb9_preview-logo.png"
            width="119"
            alt=""
            className="logo-brand-orgboat"
          />
        </a>
      </div>
      <div className="w-nav-overlay" data-wf-ignore=""></div>
    </div>
  );
}
}


