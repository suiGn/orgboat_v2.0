import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";

function ChatSidebar(props, clicked ) {
  // const [clicked, setClicked] = useState([]);
  let chats;
  let my_uid;

  chats = props.response.chats;
  my_uid = props.response.my_uid;
  console.log("Respuesta", props);
  function timeformat(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var x = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? "0" + m : m;
    var mytime = h + ":" + m + " " + x;
    return mytime;
  }

  function getDateLabel(date) {
    let dateLabelDate =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let dateLabelMonth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let dateLabelYear = date.getFullYear();
    let dateLabel = dateLabelDate + "/" + dateLabelMonth + "/" + dateLabelYear;
    return dateLabel;
  }

  return (
    <div id="chats" className="sidebar active">
      <header>
        <span>Chats</span>
        <ul className="list-inline">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            title="New group"
          >
            <a
              className="btn btn-outline-light"
              href="#"
              data-toggle="modal"
              data-target="#newGroup"
            >
              <i data-feather="users" />
            </a>
          </li>
          <li className="list-inline-item">
            <a
              className="btn btn-outline-light"
              data-toggle="tooltip"
              title="New chat"
              href="#"
              data-navigation-target="friends"
            >
              <i data-feather="plus-circle" />
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
          placeholder="Search chats"
        />
      </form>
      <div className="sidebar-body">
        <ul className="list-group list-group-flush">
          {chats &&
            chats.map((chat) => {
              if (
                chat.chat_type == 0 &&
                chat.archiveChat == 0 &&
                chat.delete_chat == 0
              ) {
                let chat_initial;
                let chat_name;
                let p;
                let chat_with_usr = chat.user_chat;
                if (my_uid != chat.user_chat) {
                  chat_name = chat.name;
                  chat_initial = chat_name.substring(0, 1);
                  let timeMessage = new Date(chat.last_message_time);
                  let timeLabel;
                  let today = new Date();
                  let yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  if (
                    timeMessage.getDate() == today.getDate() &&
                    timeMessage.getMonth() == today.getMonth() &&
                    timeMessage.getFullYear() == today.getFullYear()
                  ) {
                    timeLabel = timeformat(timeMessage);
                  } else if (
                    timeMessage.getDate() == yesterday.getDate() &&
                    timeMessage.getMonth() == yesterday.getMonth() &&
                    timeMessage.getFullYear() == yesterday.getFullYear()
                  ) {
                    timeLabel = "Yesterday";
                  } else {
                    timeLabel = getDateLabel(timeMessage);
                  }
                  //var pphotoUser = new File([""], chat.pphoto);
                  //var p = "";
                  console.log(chat.pphoto);
                  if (chat.pphoto === "") {
                    p = (
                      <span className="avatar-title bg-info rounded-circle">
                        {chat_initial}
                      </span>
                    );
                  } else {
                    p = (
                      <img
                        src={"/pphotoChat/" + chat_name}
                        className="rounded-circle"
                        alt="image"
                      />
                    );
                  }
                  return (
                    <li
                      className={(clicked === chat.chat_uid && 'is-active' ) ? 'list-group-item chat-conversation-select chat-is-active' : 'list-group-item chat-conversation-select' } 
                      key={chat.chat_uid}
                      i={chat.chat_uid}
                      n={chat_name}
                      t={timeMessage.getTime()}
                      u={chat_with_usr}
                      onClick={ () => {props.setClicked(chat.chat_uid)}}
                    >
                      <div>
                        <figure className="avatar">{p}</figure>
                      </div>
                      <div className="users-list-body">
                        <div>
                          <h5 className="last-message-user" i={chat.chat_uid}>
                            {chat_name}
                          </h5>
                          <p className="last-message-chat" i={chat.chat_uid}>
                            {chat.last_message_message}
                          </p>
                        </div>
                        <div className="users-list-action">
                          <div
                            className="new-message-count d-none"
                            i={chat.chat_uid}
                          ></div>
                          <small
                            className="text-muted last-message-time"
                            i={chat.chat_uid}
                          >
                            {timeLabel} 111
                          </small>
                          <div className="action-toggle">
                            <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                <i className="fa fa-ellipsis-h"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a href="#" className="dropdown-item">
                                  Open
                                </a>
                                <button
                                //   onClick="profiledata('${
                                //   chat.chat_uid
                                // }')"
                                  data-navigation-target="contact-information"
                                  className="dropdown-item"
                                >
                                  Profile
                                </button>
                                <a
                                  href="#"
                                //   onClick="ArchiveChat('${
                                //   chat.chat_uid
                                // }')"
                                  className="dropdown-item"
                                >
                                  Add to archive
                                </a>
                                <div className="dropdown-divider"></div>
                                <a
                                  href="#"
                                  className="dropdown-item text-danger"
                                //   onclick="DeleteChat('${
                                //   chat.chat_uid
                                // }')"
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                } else if (chat.chat_type == 1) {
                  if (chat.user_chat == chat.last_message_user_uid) {
                    let chat_name = chat.chat_name;
                    let chat_with_usr = chat.user_chat;
                    let chat_initial = chat_name.substring(0, 1);
                    let timeMessage = new Date(chat.last_message_time);
                    let timeLabel;
                    let today = new Date();
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (
                      timeMessage.getDate() == today.getDate() &&
                      timeMessage.getMonth() == today.getMonth() &&
                      timeMessage.getFullYear() == today.getFullYear()
                    ) {
                      timeLabel = timeformat(timeMessage);
                    } else if (
                      timeMessage.getDate() == yesterday.getDate() &&
                      timeMessage.getMonth() == yesterday.getMonth() &&
                      timeMessage.getFullYear() == yesterday.getFullYear()
                    ) {
                      timeLabel = "Ayer";
                    } else {
                      timeLabel = getDateLabel(timeMessage);
                    }
                    return (
                      <li
                        className="list-group-item chat-conversation-select"
                        key={chat.chat_uid}
                        i={chat.chat_uid}
                        n={chat_name}
                        t={timeMessage.getTime()}
                        u={chat_with_usr}
                        onClick={()=>console.log("holaaaa")}
                      >
                        <div>
                          <figure className="avatar">
                            <span className="avatar-title bg-info rounded-circle">
                              {chat_initial}
                            </span>
                          </figure>
                          <div className="users-list-body">
                            <div>
                              <h5
                                className="last-message-user"
                                i={chat.chat_uid}
                              >
                                {chat_name}
                              </h5>
                              <p
                                className="last-message-chat"
                                i={chat.chat_uid}
                              >
                                {chat.name}: {chat.last_message_message}
                              </p>
                            </div>
                          </div>
                          <div className="users-list-action">
                            <div
                              className="new-message-count d-none"
                              i={chat.chat_uid}
                            >
                              <small
                                className="text-muted last-message-time"
                                i={chat.chat_uid}
                              >
                                {timeLabel}
                              </small>
                              <div className="action-toggle">
                                <div className="dropdown">
                                  <a data-toggle="dropdown" href="#">
                                    <i className="fa fa-ellipsis-h"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item">
                                      Open
                                    </a>
                                    <button
                                      // onClick={profiledata({chat.chat_uid})}
                                      data-navigation-target="contact-information"
                                      className="dropdown-item"
                                    >
                                      Profile
                                    </button>
                                    <a
                                      href="#"
                                      // onClick="ArchiveChat('${chat.chat_uid}')"
                                      className="dropdown-item"
                                    >
                                      Add to archive
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a
                                      href="#"
                                      className="dropdown-item text-danger"
                                    >
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                }
              }
            })}
        </ul>
      </div>
    </div>
  );
}

export default ChatSidebar;
