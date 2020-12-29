import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { MoreHorizontal } from "react-feather";

const ENDPOINT = "http://localhost:5000";

function FriendSidebar(props) {
  const [contact, setContact] = useState([]);
  const socket = socketIOClient(ENDPOINT);
  useEffect(() => {
    socket.emit("GetContacts");
    socket.on("retrive GetContacts", (contacts) => {
      setContact(contacts);
    });
  }, []);
  function NewChat(userData) {
    props.setClicked(userData);
    socket.emit("newChat", { chat_uid: userData.chat_uid });
    socket.on("retrive newchat", () => {
      socket.emit("get chats");
    });
  }
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
              <i data-feather="user-plus" className="mr-2" /> Add Contact
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
          {contact.chats &&
            contact.chats.map((user) => {
              let my_uid = contact.my_uid;
              if (user.chat_type === 0) {
                if (my_uid != user.user_chat) {
                  let chat_name = user.name;
                  let p;
                  let chat_initial = chat_name.substring(0, 1);
                  if (user.pphoto === "") {
                    p = (
                      <span className="avatar-title bg-info rounded-circle">
                        {chat_initial}
                      </span>
                    );
                  } else {
                    p = (
                      <img
                        src={user.pphoto}
                        className="rounded-circle"
                        alt="image"
                      />
                    );
                  }
                  return (
                    <li
                      className="list-group-item chat-conversation-select"
                      i={user.chat_uid}
                      n={chat_name}
                      data-navigation-target="chats"
                    >
                      <div>
                        <figure className="avatar">{p}</figure>
                      </div>
                      <div className="users-list-body">
                        <div>
                          <h5
                            className="last-message-user"
                            i={user.chat_uid}
                            n={chat_name}
                          >
                            {chat_name}
                          </h5>
                          <p className="last-message-chat">{chat_name}</p>
                        </div>
                        <div className="users-list-action">
                          <div className="action-toggle">
                            <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                <MoreHorizontal />
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a
                                  href="#"
                                  onClick={() => NewChat(user)}
                                  className="dropdown-item"
                                >
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
                                <a
                                  href="#"
                                  className="dropdown-item text-danger"
                                >
                                  Block
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }
              }
            })}
        </ul>
      </div>
    </div>
  );
}

export default FriendSidebar;
