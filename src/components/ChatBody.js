import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ChatBodyNoMessage from "./ChatBodyNoMessage";
import ChatBodyMessage from "./ChatBodyMessage";
import ChatSideBar from "./ChatSidebar";
import ReactDOM from "react-dom";
import $ from "jquery";
const ENDPOINT = "http://localhost:5000";

function ChatBody({ messages, my_uid, clicked, SendMessage }) {
  // const [chatMessages, setChatMessages] = useState([]);
  let messagesArray;
  let currentPage = 0;

  console.log(clicked);
  // useEffect(() => {
  //   if (clicked != 0) {
  //     const socket = socketIOClient(ENDPOINT);
  //     console.log("uid", clicked);

  //     socket.on("retrieve messages", (response) => {
  //       setChatMessages((chatMessages) => [...chatMessages, response]);
  //       socket.emit("get chats");
  //       console.log("messages", response);
  //     });
  //     currentPage = currentPage + 1;
  //     socket.emit("get messages", { id: clicked, page: currentPage });
  //   }
  // }, [clicked]);

  // function SendMessage(event, newMessage, chat_uid) {
  //   event.preventDefault();

  //   const socket = socketIOClient(ENDPOINT);
  //   if (newMessage.length > 0) {
  //     socket.emit("chat message", { chat: chat_uid, message: newMessage });
  //     socket.emit("get chats");
  //     socket.emit("get messages", { id: chat_uid, page: currentPage });
  //     // setnewMessage("");
  //   }
  // }

  messagesArray = messages;
  // messages = response.chats;
  // my_uid = response.my_uid;
  // console.log("Respuesta", response);
  return (
    <div className="chat">
      {messagesArray[messagesArray.length - 1] &&
      messagesArray[messagesArray.length - 1].messages &&
      messagesArray[messagesArray.length - 1].messages.length > 0 ? (
        <ChatBodyMessage
          messages={messagesArray[messagesArray.length - 1].messages}
          chat_uid={clicked}
          my_uid={my_uid}
          page={currentPage}
          SendMessage={SendMessage}
        />
      ) : (
        <ChatBodyNoMessage />
      )}
    </div>
  );
}

export default ChatBody;
