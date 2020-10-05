import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ChatBodyNoMessage from "./ChatBodyNoMessage"
import ChatBodyMessage from "./ChatBodyMessage"
import ChatSideBar from './ChatSidebar';
import ReactDOM from 'react-dom';
import $ from "jquery";
const ENDPOINT = "http://127.0.0.1:5000";

function ChatBody({clicked}) {
  const [chatMessages, setChatMessages] = useState([]);
  let messagesArray;
  let my_uid;
  let currentPage = 0;


      console.log(clicked)
    useEffect(() => {
      if(clicked!= 0){
        const socket = socketIOClient(ENDPOINT);
        console.log(clicked)
        
      socket.on("retrieve messages", (response) => {
        setChatMessages(response);
        console.log(response);
        });    

        socket.emit("get messages", { id:clicked, page: currentPage + 1 } );
        
      }
      
  }, [clicked])

  messagesArray = chatMessages;
  console.log(chatMessages.messages)
  console.log("len",messagesArray.length)
  // messages = response.chats;
  // my_uid = response.my_uid;
  // console.log("Respuesta", response);
  return (
    <div className="chat">
      {
        (messagesArray && messagesArray.messages && messagesArray.messages.length > 0) ? 
        <ChatBodyMessage messages = {messagesArray.messages} uid = {clicked} /> :
        <ChatBodyNoMessage/>
        
      }
    </div>
  );
}

export default ChatBody;
