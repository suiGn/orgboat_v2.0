import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import EditProfile from "./EditProfile";
import { BrowserRouter as Redirect, Link } from "react-router-dom";
import { User, MessageCircle, Star, Moon, Archive } from "react-feather";
import blue_helm2 from "../Images/blue_helm2.png";
import axios from "axios";
import Cookies from 'universal-cookie';
const ENDPOINT = "http://localhost:5000";

function Navigator(props) {
  const [logout, setLogout] = useState(false);
  // useEffect(() => {
  //   renderRedirect();
  // }, []);
  const cookies = new Cookies();
  function profiledata(id) {
    const socket = socketIOClient(ENDPOINT);

    socket.emit("ViewOwnProfile", { id: id });
    socket.on("retrieve viewownprofile", function (data) {
      props.setuserProfile(data);
    });
  }

  function logoutServer() {
    axios.get("/logout").then((res) => {
      if (res.data.ok == true) {
        console.log(res);
        //cookies.remove("SESSION_ID", {path: "/", domain: "localhost"});
        window.location.reload();
        //setLogout(res.ok);
        //props.setloggedIn(false);
      }
    });

    // fetch("http://localhost:5000/logout")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setLogout(data.ok);
    //   });
  }
  // useEffect(() => {
  //   //props.setloggedIn(false);
  //   //renderRedirect();
  //   console.log(logout);
  //   window.location.reload();
  // }, [logout]);
  // const handleShow = () => props.setShow(true);

  const renderRedirect = () => {
    if (logout) {
      return <Redirect to="/" />;
    }
  };
  return (
    <nav className="navigation">
      <div className="nav-group">
        <ul>
          <li className="logo">
            <a href="#">
              <img src={blue_helm2} width={42} height alt="Blue Helm" />
            </a>
          </li>
          <li>
            <a
              className="active"
              data-navigation-target="chats"
              href="#"
              data-toggle="tooltip"
              title="Chats"
              data-placement="right"
            >
              <span className="badge badge-warning"></span>
              <MessageCircle />
            </a>
          </li>
          <li>
            <a
              data-navigation-target="friends"
              href="#"
              data-toggle="tooltip"
              title="Friends"
              data-placement="right"
            >
              <span className="badge badge-danger"></span>
              <User />
            </a>
          </li>
          <li>
            <a
              data-navigation-target="favorites"
              data-toggle="tooltip"
              title="Favorites"
              data-placement="right"
              href="#"
            >
              <Star />
            </a>
          </li>
          <li className="brackets">
            <a
              data-navigation-target="archived"
              href="#"
              data-toggle="tooltip"
              title="Archived"
              data-placement="right"
            >
              <Archive />
            </a>
          </li>
          <li>
            <a
              href="#"
              className="dark-light-switcher"
              data-toggle="tooltip"
              title="Dark mode"
              data-placement="right"
            >
              <Moon />
            </a>
          </li>
          <li data-toggle="tooltip" title="User menu" data-placement="right">
            <a href="./login.html" data-toggle="dropdown">
              <figure className="avatar">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </a>
            <div className="dropdown-menu">
              <a
                href="#"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#editProfileModal"
                onClick={() => profiledata(props.my_uid)}
              >
                Edit profile
              </a>
              <a
                href="#"
                onClick={() => profiledata(props.my_uid)}
                className="dropdown-item"
                data-navigation-target="contact-information"
              >
                Profile
              </a>
              <a
                href="#"
                className="dropdown-item"
                data-toggle="modal"
                data-target="#settingModal"
              >
                Settings
              </a>
              <div className="dropdown-divider"></div>
              <Link to="/">
                <button
                  href="/"
                  className="dropdown-item text-danger"
                  onClick={logoutServer}
                >
                  Logout
                </button>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigator;
