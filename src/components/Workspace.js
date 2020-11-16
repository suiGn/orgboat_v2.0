import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Navigator from "./Navigator.js";
import ChatSidebar from "./ChatSidebar";
import ArchiveSidebar from "./ArchiveSidebar";
import FriendSidebar from "./FriendSidebar";
import FavoriteSidebar from "./FavoriteSidebar";
import ChatBody from "./ChatBody";
import Profile from "./Profile.js";
import EditProfile from './EditProfile';
const ENDPOINT = "http://localhost:5000/";

function Workspace() {
  const [response, setResponse] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [userProfile, setuserProfile] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [show, setShow] = useState(false);

  let chats;
  let currentPage = 0;

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("get chats");
    console.log(response);
    socket.on("retrieve chats", (response) => {
      setResponse(response);
      console.log(response);
    });
    console.log("uid", clicked);

    socket.on("retrieve messages", (response) => {
      setChatMessages((chatMessages) => [...chatMessages, response]);
      // setChatMessages(response);
      // socket.emit("get chats");
      console.log("messages", response);
    });
    currentPage = currentPage + 1;
    socket.emit("get messages", { id: clicked, page: currentPage });
  }, [clicked, ENDPOINT]);

  console.log(clicked);
  let my_uid = response.my_uid;

  function SendMessage(event, newMessage, chat_uid) {
    event.preventDefault();

    const socket = socketIOClient(ENDPOINT);
    if (newMessage.length > 0) {
      socket.emit("chat message", { chat: chat_uid, message: newMessage });
      socket.emit("get chats");
      socket.emit("get messages", { id: chat_uid, page: currentPage });
      // setnewMessage("");
    }
  }

  return (
    <div className="layout">
      <EditProfile show={show} handleClose={setShow} />
      <Navigator my_uid={my_uid} setuserProfile={setuserProfile} setEditProfile={setShow}/>
      <div className="content">
        <div className="sidebar-group">
          <ChatSidebar
            clicked={clicked}
            setClicked={setClicked}
            response={response}
            setuserProfile={setuserProfile}
          />
          <ArchiveSidebar
            clicked={clicked}
            setClicked={setClicked}
            response={response}
          />
          <FriendSidebar />
          <FavoriteSidebar />
        </div>
        <ChatBody
          messages={chatMessages}
          SendMessage={SendMessage}
          my_uid={my_uid}
          clicked={clicked}
        />
        <Profile userProfile={userProfile} />

      </div>
    </div>
  );
}

export default Workspace;
