import React, { useEffect } from "react";
// import {ReactComponent as Logo} from '../assets/logo.svg'
import { ReactComponent as Logo } from "../assets/icons/blue_helm2.svg";
import "../assets/css/styles.css";

function SignIn() {
  useEffect(() => document.body.classList.add("form-membership"), []);

  return (
    <div className="form-wrapper">
      {/* <div
        data-collapse="medium"
        data-animation="default"
        data-duration="400"
        data-ix="fade-in-right-scroll-in-2"
        role="banner"
        className="navigation-bar w-nav"
      >
        <div className="w-container">
          <nav role="navigation" className="navigation-menu w-nav-menu">
            {this.props.login == "signup" ? (
              <a href="/" className="navigation-link login w-nav-link">
                Login
              </a>
            ) : (
              <a href="/signup" className="navigation-link login w-nav-link">
                Sign Up
              </a>
            )}
            <a href="#" className="navigation-link w-nav-link">
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
      </div> */}
      <div className="logo">
        <Logo />
      </div>
      <h5>Sign in</h5>
      <form action="/login" method="post">
        <div className="form-group">
          <input
            type="text"
            name="usrname"
            className="form-control"
            placeholder="Username or email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="pwd"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <div className="form-group d-flex justify-content-between">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              checked=""
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
          <a href="/reset-password">Reset password</a>
        </div>
        <button
          type="submit"
          data-wait="Please wait..."
          className="btn btn-primary btn-block"
        >
          Sign in
        </button>
        <hr />
        <p className="text-muted">Login with your social media account.</p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-facebook">
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-twitter">
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-dribbble">
              <i className="fa fa-dribbble"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-linkedin">
              <i className="fa fa-linkedin"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-google">
              <i className="fa fa-google"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-behance">
              <i className="fa fa-behance"></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="/" className="btn btn-floating btn-instagram">
              <i className="fa fa-instagram"></i>
            </a>
          </li>
        </ul>
        <hr />
        <p className="text-muted">Don't have an account?</p>
        <a href="/sign-up" className="btn btn-outline-light btn-sm">
          Register now!
        </a>
      </form>
    </div>
  );
}

export default SignIn;
