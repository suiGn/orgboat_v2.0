import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function ChatBodyMessage(props) {
  const [newMessage, setnewMessage] = useState([]);

  let messages = [].concat(props.messages).reverse();

  let actualLabelDate = "";
  let message_user_uid;
  let pphoto = "";
  let name = "";
  let p;
  let chat_uid = props.chat_uid;
  let my_uid = props.my_uid;

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

  function getPhoto() {
    if (my_uid != messages[0].message_user_uid) {
      pphoto = messages[0].pphoto;
      name = messages[0].name;
    }
    if (pphoto == "") {
      return (
        <span className="avatar-title bg-info rounded-circle">
          {name.substring(0, 1)}
        </span>
      );
    } else {
      return (
        <img
          src={"pphotoChat/" + name}
          className="rounded-circle"
          alt="image"
        />
      );
    }
  }
  let dateSend = new Date(messages[0].time);

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

  console.log("cookie", document.cookie);

  return (
    <div>
      <div className="chat-header">
        <div className="chat-header-user">{getPhoto()}</div>
        <div className="chat-header-action">
          <ul className="list-inline">
            <li className="list-inline-item d-xl-none d-inline">
              <a
                href="#"
                className="btn btn-outline-light mobile-navigation-button"
              >
                <i className="ti-more" />
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
                <i className="ti-mobile" />
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
                <i className="ti-video-camera" />
              </a>
            </li>
            <li className="list-inline-item">
              <a
                href="#"
                className="btn btn-outline-light"
                data-toggle="dropdown"
              >
                <i className="ti-more" />
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a
                  href="#"
                  data-navigation-target="contact-information"
                  className="dropdown-item"
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
          {messages.map((message, index) => {
            message_user_uid = message.message_user_uid;

            dateSend = new Date(message.time);
            let timeSend = timeformat(dateSend);
            let out = my_uid == message_user_uid ? "outgoing-message" : "";
            let ticks =
              my_uid == message_user_uid ? <i className="ti-check"></i> : ""; // double checked
            let usrname =
              message.chat_type == 1 && my_uid != message_user_uid
                ? message.name
                : "";

            return (
              <div className="messages-container" key={index + 1}>
                {getTodayLabel(getDateLabel(dateSend))}
                <div className={"message-item " + out}>
                  {usrname}
                  <div className="message-content">
                    <a
                      href="#"
                      className="btn btn-outline-light"
                      data-toggle="dropdown"
                    >
                      <i className="ti-more" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a
                        href="#"
                        className="dropdown-item"
                        onClick="DeleteChat('a4bbbc58-97ea-46a9-8065-6a3194b9527b')"
                      >
                        Delete
                      </a>
                    </div>
                    {message.message}
                    <div className="message-avatar">
                      <div>
                        <div className="time">
                          {timeSend} {ticks}
                          <i className="ti-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <form
          onSubmit={(event) => props.SendMessage(event, newMessage, chat_uid)}
        >
          <div>
            <button
              className="btn btn-light mr-3"
              data-toggle="tooltip"
              title="Emoji"
              type="button"
            >
              <i className="ti-face-smile" />
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
              <i className="ti-clip" />
            </button>
            <button
              className="btn btn-light d-sm-none d-block"
              data-toggle="tooltip"
              title="Send a voice record"
              type="button"
            >
              <i data-feather="mic" />
            </button>
            <button className="btn btn-primary" type="submit">
              <i className="ti-location-arrow" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBodyMessage;
