import React, { useEffect, useState } from "react";
import moment from "moment";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ManAvatar3 from "../../assets/img/man_avatar3.jpg";
import { selectedChat } from "../Sidebars/Chats/Data";
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatsMessageDropdown from "../Sidebars/Chats/ChatsMessageDropdown.js";
import UnselectedChat from "../../assets/img/unselected-chat.svg";

function Chat(props) {
  const [inputMsg, setInputMsg] = useState("");

  const [newMessage, setMessages] = useState(selectedChat);

  const [scrollEl, setScrollEl] = useState();

  const [messages, setChatMessages] = useState([]);

  let dateSend;

  if (messages && messages.length > 0) {
    dateSend = new Date(messages[0].time);
  }
  const { socket } = props;

  useEffect(() => {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [scrollEl]);

  useEffect(() => {
    socket.on("retrieve messages", (data) => {
      setChatMessages(data.messages.reverse());
      // socket.emit("get chats");
    });
    socket.on("chat message", (data) => {
      socket.emit("get chats");
      socket.emit("get messages", { id: data.chat, page: 1 });
    });
    socket.on("retrive update notification", (data) => {
      socket.emit("get chats");
    });
    if (props.clicked && scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  });

  useEffect(() => {
    socket.emit("get messages", { id: props.clicked.chat_uid, page: 1 });
    //socket.emit("update notification",{id: props.clicked.chat_uid});
  }, [props.clicked]);

  const handleSubmit = (newValue) => {
    if (newMessage.length > 0) {
      socket.emit("chat message", {
        chat: newValue.chat_uid,
        message: newValue.text,
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
    let type;
    if(message.chat_type == 1){
      if (message.message_user_uid == props.id) {
        type = "outgoing-message";
      } else {
        type = "undefined";
      }
    }else{
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
              <h5>{message.name}</h5>
              <div className="time">
                {moment(message.time).format("DD-MM-YYYY")}
                {message.type ? (
                  <i className="ti-double-check text-info"></i>
                ) : null}
              </div>
            </div>
          </div>
          {message.media ? (
            message.media
          ) : (
            <div className="message-content position-relative">
              {message.message}{" "}
              <div className="action-toggle action-dropdown-chat">
                <ChatsMessageDropdown message={message} prop_id={props.id} my_uid={props.my_uid} chat_id={props.chat_id} socket={socket}/>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="chat">
      <ChatHeader
        data={props.clicked}
        socket={socket}
        chat_uid={props.clicked.chat_uid}
        id={props.clicked.user_chat}
        setUser={props.setUser}
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
  );
}

export default Chat;