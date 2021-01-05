import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import {
  Menu,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  Mic,
  ChevronDown,
  Check,
} from "react-feather";
const ENDPOINT = "https://www.orgboat.me";

function ChatBodyMessage(props) {
  const [newMessage, setnewMessage] = useState([]);
  let messages;
  let userData;
  let dateSend;
  if (props.messages && props.messages.length > 0) {
    messages = [].concat(props.messages).reverse();
    dateSend = new Date(messages[0].time);
  }
  props.clicked ? (userData = props.clicked) : (userData = []);
  console.log(userData);
  let actualLabelDate = "";
  let message_user_uid;
  let pphoto =
    my_uid != userData.message_user_uid ? (pphoto = userData.pphoto) : "";
  let name = my_uid != userData.message_user_uid ? userData.name : "";
  let p;
  let chat_uid = userData.chat_uid;
  let my_uid = props.my_uid;

  // props.setNewChat([]);

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

  console.log("chat uid", userData);

  function getPhoto() {
    if (my_uid != userData.message_user_uid) {
      pphoto = userData.pphoto;
      name = userData.name;
    }
    if (pphoto == "") {
      return (
        <figure className="avatar">
          <span className="avatar-title bg-info rounded-circle">
            {name.substring(0, 1)}
          </span>
        </figure>
      );
    } else {
      return (
        <figure>
          <img src={pphoto} className="rounded-circle" alt="image" />
        </figure>
      );
    }
  }

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayLabel = getDateLabel(yesterday);
  let todayLabel = getDateLabel(new Date());

  function getTodayLabel(dateLabel) {
    if (dateLabel == yesterdayLabel) {
      dateLabel = "Ayer";
    } else if (dateLabel == todayLabel) {
      dateLabel = "Hoy";
    }

    if (actualLabelDate == dateLabel) {
      return "";
    } else {
      actualLabelDate = dateLabel;
      return (
        <div
          className="message-item messages-divider sticky-top"
          data-label={actualLabelDate}
        ></div>
      );
    }
  }

  function SendMessage(event) {
    event.preventDefault();

    const socket = socketIOClient(ENDPOINT);
    if (newMessage.length > 0) {
      socket.emit("chat message", { chat: chat_uid, message: newMessage });
      socket.emit("get chats");
      socket.emit("get messages", { id: chat_uid, page: props.currentPage });
      setnewMessage("");
    }
  }
  function DeleteMessage(message) {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("Delete message", { message: message });
    socket.on("retriveDeleteMessage", () => {
      //socket.emit("get chats");
      socket.emit("get messages", { id: chat_uid, page: props.currentPage });
      setnewMessage("");
    });
  }

  function profiledata(id) {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("ViewProfile", { id: id });
    socket.on("retrieve viewprofile", function (data) {
      props.setuserProfile(data);
    });
  }

  return (
    <div>
      <div className="chat-header">
        <div className="chat-header-user">
          {getPhoto()}
          <div>
            <h5 id="chat-name">{name} </h5>
            {/* <small className="text-success">{" <i>writing...</i>"}</small> */}
          </div>
        </div>
        <div className="chat-header-action">
          <ul className="list-inline">
            <li className="list-inline-item d-xl-none d-inline">
              <a
                href="#"
                className="btn btn-outline-light mobile-navigation-button"
              >
                <Menu />
              </a>
            </li>
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              title="Voice call"
            >
              <a
                href="#"
                className="btn btn-outline-light text-success"
                data-toggle="modal"
                data-target="#call"
              >
                <Phone />
              </a>
            </li>
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              title="Video call"
            >
              <a
                href="#"
                className="btn btn-outline-light text-warning"
                data-toggle="modal"
                data-target="#videoCall"
              >
                <Video />
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="#"
                className="btn btn-outline-light"
                data-toggle="dropdown"
              >
                <MoreHorizontal />
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a
                  href="#"
                  data-navigation-target="contact-information"
                  className="dropdown-item"
                  onClick={() => profiledata(chat_uid)}
                >
                  Profile
                </a>
                <a href="#" className="dropdown-item">
                  Add to archive
                </a>
                <a href="#" className="dropdown-item">
                  Delete
                </a>
                <div className="dropdown-divider" />
                <a href="#" className="dropdown-item text-danger">
                  Block
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-body">
        <div className="messages">
          {messages && messages.length > 0
            ? messages.map((message, index) => {
                message_user_uid = message.message_user_uid || message.from;
                dateSend = new Date(message.time);
                let timeSend = timeformat(dateSend);
                let out = my_uid == message_user_uid ? "outgoing-message" : "";
                let ticks =
                  my_uid == message_user_uid ? <Check size={12} /> : ""; // double checked
                let usrname =
                  message.chat_type == 1 && my_uid != message_user_uid
                    ? message.name
                    : "";
                return (
                  <div className="messages-container" key={index + 1}>
                    {getTodayLabel(getDateLabel(dateSend))}
                    <div className={"message-item " + out}>
                      {usrname}
                      <div className="message-content relative">
                        <div className="message-holder">{message.message}</div>

                        {/* <a
                      href="#"
                      className="btn btn-outline-light"
                      data-toggle="dropdown"
                    >
                      <i class="fas fa-ellipsis-h"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={() => DeleteMessage(message)}
                      >
                        Delete
                      </a>
                    </div> */}
                        <div class="btn action-toggle action-dropdown-chat">
                          <div class="dropdown dropdown-chat-message">
                            <a
                              className="text-light"
                              data-toggle="dropdown"
                              href="#"
                            >
                              <ChevronDown />
                            </a>
                            <div class="dropdown-menu dropdown-menu-left">
                              <a
                                href="#"
                                class="dropdown-item"
                                onClick={() => DeleteMessage(message)}
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                        {/* flex-end relative custom-time-holder */}
                        <div className="message-avatar">
                          <div className="custom-time">
                            <div className="time">
                              {timeSend} {ticks}
                              {/* <Check /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <div className="chat-footer">
        <form onSubmit={(event) => SendMessage(event, newMessage, chat_uid)}>
          <div>
            <button
              className="btn btn-light mr-3"
              data-toggle="tooltip"
              title="Emoji"
              type="button"
            >
              <Smile />
            </button>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Write a message."
            value={newMessage}
            onChange={(e) => setnewMessage(e.target.value)}
          />
          <div className="form-buttons">
            <button
              className="btn btn-light"
              data-toggle="tooltip"
              title="Add files"
              type="button"
            >
              <Paperclip />
            </button>
            <button
              className="btn btn-light d-sm-none d-block"
              data-toggle="tooltip"
              title="Send a voice record"
              type="button"
            >
              <Mic />
            </button>
            <button className="btn btn-primary" type="submit">
              <Send />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBodyMessage;
