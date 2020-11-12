import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

function FriendSidebar() {
  const [archive, setArchive] = useState([]);

  return (
    <div id="friends" className="sidebar">
      <header>
        <span>Friends</span>
        <ul className="list-inline">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            title="Add friends"
          >
            <a
              className="btn btn-outline-light"
              href="#"
              data-toggle="modal"
              data-target="#addFriends"
            >
              <i data-feather="user-plus" />
            </a>
          </li>
          <li className="list-inline-item d-xl-none d-inline">
            <a
              href="#"
              className="btn btn-outline-light text-danger sidebar-close"
            >
              <i data-feather="x" />
            </a>
          </li>
        </ul>
      </header>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder="Search friends"
        />
      </form>
      <div className="sidebar-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Harrietta Souten</h5>
                <p>Dental Hygienist</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-warning">
                <span className="avatar-title bg-success rounded-circle">
                  A
                </span>
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Aline McShee</h5>
                <p>Marketing Assistant</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-success">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Brietta Blogg</h5>
                <p>Actuary</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-success">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Karl Hubane</h5>
                <p>Chemical Engineer</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Jillana Tows</h5>
                <p>Project Manager</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-success">
                <span className="avatar-title bg-info rounded-circle">AD</span>
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Alina Derington</h5>
                <p>Nurse</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-secondary">
                <span className="avatar-title bg-warning rounded-circle">
                  S
                </span>
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Stevy Kermeen</h5>
                <p>Associate Professor</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Stevy Kermeen</h5>
                <p>Senior Quality Engineer</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Gloriane Shimmans</h5>
                <p>Web Designer</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item" data-navigation-target="chats">
            <div>
              <figure className="avatar avatar-state-warning">
                <span className="avatar-title bg-secondary rounded-circle">
                  B
                </span>
              </figure>
            </div>
            <div className="users-list-body">
              <div>
                <h5>Bernhard Perrett</h5>
                <p>Software Engineer</p>
              </div>
              <div className="users-list-action">
                <div className="action-toggle">
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#">
                      <i data-feather="more-horizontal" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="#" className="dropdown-item">
                        New chat
                      </a>
                      <a
                        href="#"
                        data-navigation-target="contact-information"
                        className="dropdown-item"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item text-danger">
                        Block
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FriendSidebar;
