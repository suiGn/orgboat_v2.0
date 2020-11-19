import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ChatBodyNoMessage from "./ChatBodyNoMessage";
import ChatBodyMessage from "./ChatBodyMessage";
import ChatSideBar from "./ChatSidebar";
import ReactDOM from "react-dom";
import $ from "jquery";
const ENDPOINT = "http://localhost:5000";

function ChatBody({ my_uid, clicked }) {
  const [chatMessages, setChatMessages] = useState([]);
  let messagesArray;
  let currentPage = 0;
  const socket = socketIOClient(ENDPOINT);
  useEffect(() => {
    if (clicked != 0) {
      currentPage = currentPage + 1;
      socket.emit("get messages", { id: clicked, page: currentPage });
    }
    socket.on("retrieve messages", (response) => {
      // setChatMessages((chatMessages) => [...chatMessages, response.messages]);
      setChatMessages(response.messages);
      socket.emit("get chats");
    });
  }, [clicked]);

  useEffect(() => {
    socket.on("chat message", (response) => {
      setChatMessages((chatMessages) => [response, ...chatMessages]);
      socket.emit("get chats");
    });
  }, []);

  messagesArray = chatMessages;
  // messages = response.chats;
  // my_uid = response.my_uid;
  console.log("messagesArray", messagesArray);
  return (
    <div className="chat">
      {messagesArray && messagesArray.length > 0 && clicked ? (
        <ChatBodyMessage
          messages={messagesArray}
          chat_uid={clicked}
          my_uid={my_uid}
          page={currentPage}
        />
      ) : (
        <ChatBodyNoMessage />
      )}
    </div>
  );
}

export default ChatBody;
