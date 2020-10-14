import React from "react";

function ChatBodyMessage(props) {
  let messages = props.messages;
  let actualLabelDate = "";
  let message_user_uid;
  let pphoto = "";
  let name = "";
  let p;
  let chat_uid = props.chat_uid;
  let my_uid = props.my_uid;

  console.log("uid", my_uid);

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
  let dateLabel = getDateLabel(dateSend);
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayLabel = getDateLabel(yesterday);
  let todayLabel = getDateLabel(new Date());

  function getTodayLabel() {
    if (dateLabel == yesterdayLabel) {
      dateLabel =
        "&#160;&#160;&#160;&#160;&#160;&#160;Ayer&#160;&#160;&#160;&#160;&#160;&#160;";
    } else if (dateLabel == todayLabel) {
      dateLabel =
        "&#160;&#160;&#160;&#160;&#160;&#160;Hoy&#160;&#160;&#160;&#160;&#160;&#160;";
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

  console.log(messages);

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
          {getTodayLabel()}

          {messages.map((message) => {
            message_user_uid = message.message_user_uid;

            let timeSend = timeformat(dateSend);
            console.log("nuevo", my_uid, message_user_uid);
            let out = my_uid == message_user_uid ? "outgoing-message" : "";
            let ticks =
              my_uid == message_user_uid ? <i class="ti-check"></i> : ""; // double checked
            let usrname =
              message.chat_type == 1 && my_uid != message_user_uid
                ? message.name
                : "";
            return (
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
                      onclick="DeleteChat('a4bbbc58-97ea-46a9-8065-6a3194b9527b')"
                    >
                      Delete
                    </a>
                  </div>
                  {message.message}
                  <div className="message-avatar">
                    <div>
                      <div className="time">
                        {timeSend} {ticks}
                        <i class="ti-check"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChatBodyMessage;
