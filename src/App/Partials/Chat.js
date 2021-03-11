import React, { useEffect, useState } from "react";
import moment from "moment";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ManAvatar3 from "../../assets/img/man_avatar3.jpg";
import { selectedChat } from "../Sidebars/Chats/Data";
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatsMessageDropdown from "../Sidebars/Chats/ChatsMessageDropdown.js";
import UnselectedChat from "../../assets/img/unselected-chat.svg";
import UIfx from "uifx";
import notificationAudio from "../../assets/sound/much.mp3";
import empty from "../../assets/img/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
import * as FeatherIcon from "react-feather";

function Chat(props) {
  const [inputMsg, setInputMsg] = useState("");

  const [newMessage, setMessages] = useState(selectedChat);

  const [scrollEl, setScrollEl] = useState();

  const [messages, setChatMessages] = useState([]);

  const [click, setClick] = useState([]);

  const mobileMenuBtn = () => document.body.classList.toggle("navigation-open");

  const notificationSound = new UIfx(notificationAudio, {
    volume: 0.4,
    throttleMs: 100,
  });

  let dateSend;

  if (messages && messages.length > 0) {
    dateSend = new Date(messages[0].time);
  }
  const { socket } = props;

  const { clicked } = props;

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [scrollEl]);

  function RetrieveMessages(data) {
    if (data.messages.length != 0) {
      if (props.clicked.chat_uid == data.messages[0].chat_uid) {
        var messages = [];
        data.messages.forEach((element) => {
          if (element.delete_message_to == 1) {
            if (element.message_user_uid == props.my_uid.id) {
              messages.push(element);
            }
          } else {
            messages.push(element);
          }
        });
        setChatMessages(messages.reverse());
      }
    } else {
      setChatMessages([]);
    }
  }

  function OnChatMessage(data) {
    if (props.clicked.chat_uid) {
      if (props.clicked.chat_uid == data.chat) {
        socket.emit("get messages", { id: data.chat, page: 1, inChat: true });
      } else if (props.clicked.chat_uid != data.chat) {
        notificationSound.play();
        socket.emit("get messages", { id: data.chat, page: 1, inChat: false });
      }
    } else {
      notificationSound.play();
    }
    socket.emit("get chats");
  }

  useEffect(() => {
    setChatMessages([]);
    socket.on("retrieve messages", RetrieveMessages);
    socket.emit("get messages", {
      id: props.clicked.chat_uid,
      page: 1,
      inChat: true,
    });
    socket.on("chat message", OnChatMessage);

    if (props.clicked && scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }

    return () => {
      socket.off("chat message", OnChatMessage);
      socket.off("retrieve messages", RetrieveMessages);
    };
  }, [props.clicked]);

  const handleSubmit = (newValue) => {
    if (newMessage.length > 0) {
      socket.emit("chat message", {
        chat: newValue.chat_uid,
        message: newValue.text,
        is_image: newValue.is_image,
        is_file: newValue.is_file,
      });
      socket.emit("get chats");
      socket.emit("get messages", { id: newValue.chat_uid, page: 1 });
    }
    setInputMsg("");
  };

  const handleChange = (newValue) => {
    setInputMsg(newValue);
  };
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
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayLabel = getDateLabel(yesterday);
  let todayLabel = getDateLabel(new Date());
  let actualLabelDate = "";

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

  const MessagesView = (props) => {
    const { message } = props;
    const { group } = props;
    let type;
    if (message.chat_type == 1) {
      if (message.message_user_uid == props.id) {
        type = "outgoing-message";
      } else {
        type = "undefined";
      }
    } else {
      if (message.message_user_uid == props.id) {
        type = "undefine";
      } else {
        type = "outgoing-message";
      }
    }
    if (message.type === "divider") {
      return (
        <div
          className="message-item messages-divider sticky-top"
          data-label={message.message}
        ></div>
      );
    } else {
      return (
        <div className={"message-item " + type}>
          <div className="message-avatar">
            {/* {message.avatar} */}
            <div>
              {group && message.message_user_uid != props.my_uid ? (
                <h5>{message.name}</h5>
              ) : (
                ""
              )}
              {/* <h5>{message.name}</h5> */}
              {/* <div className="time">
                {moment(message.time).format("DD-MM-YYYY")}
                {message.type ? (
                  <i className="ti-double-check text-info"></i>
                ) : null}
              </div> */}
            </div>
          </div>
          {message.media ? (
            message.media
          ) : (
            <div className="message-content position-relative">
              {!message.is_image && !message.is_file ? (
                <div className="word-break">{message.message}</div>
              ) : message.is_image ? (
                <figure className="avatar avatar-xl">
                  <img src={message.message} />
                </figure>
              ) : (
                <a href={message.message} download>
                  <FeatherIcon.Download />{" "}
                  {"file "}
                </a>
              )}
              <div className="misc-container">
                <div className="time">
                  {moment(message.time).format("LT")}
                  {message.type ? (
                    <i className="ti-double-check text-info"></i>
                  ) : null}
                </div>
                <div className="action-toggle action-dropdown-chat">
                  <ChatsMessageDropdown
                    message={message}
                    prop_id={props.id}
                    my_uid={props.my_uid}
                    chat_id={props.chat_id}
                    socket={socket}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return clicked.name ? (
    <div className="chat">
      <ChatHeader
        data={props.clicked}
        socket={socket}
        chat_uid={props.clicked.chat_uid}
        id={props.clicked.user_chat}
        setUser={props.setUser}
        setGroup={props.setGroup}
        setOpenUserProfile={props.setOpenUserProfile}
        openUserProfile={props.openUserProfile}
        setOpenProfile={props.setOpenProfile}
        openProfile={props.openProfile}
      />
      <PerfectScrollbar containerRef={(ref) => setScrollEl(ref)}>
        <div className="chat-body">
          <div className="messages">
            {messages.map((message, i) => (
              <div className="messages-container">
                {getTodayLabel(getDateLabel(dateSend))}
                <MessagesView
                  message={message}
                  key={i}
                  id={props.clicked.user_chat}
                  my_uid={props.my_uid}
                  setUser={props.setUser}
                  chat_id={props.clicked.chat_uid}
                  group={props.clicked.chat_type}
                />
              </div>
            ))}
          </div>
        </div>
      </PerfectScrollbar>
      <ChatFooter
        onSubmit={handleSubmit}
        onChange={handleChange}
        inputMsg={inputMsg}
        setInputMsg={setInputMsg}
        chat_uid={props.clicked.chat_uid}
        darkSwitcherTooltipOpen={props.darkSwitcherTooltipOpen}
      />
    </div>
  ) : (
    <div className="chat">
      <div className="chat-header justify-content-end">
        <div className="chat-header-action">
          <ul className="list-inline">
            <li className="list-inline-item d-xl-none d-inline">
              <button
                onClick={mobileMenuBtn}
                className="btn btn-outline-light mobile-navigation-button"
              >
                <Menu />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-body ">
        <div
          id="nochatselected"
          className="justify-content-center align-items-center d-flex h-100"
        >
          <div className="no-message-container custom-chat-message">
            <div className="row mb-5 chat-body-custom">
              <div className="col-12 text-center">
                <img src={empty} width="400px" className="" alt="image" />
              </div>
            </div>
            <p className="lead text-center">Welcome to OrgBoat!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
