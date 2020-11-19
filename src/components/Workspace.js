import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Navigator from "./Navigator.js";
import ChatSidebar from "./ChatSidebar";
import ArchiveSidebar from "./ArchiveSidebar";
import FriendSidebar from "./FriendSidebar";
import FavoriteSidebar from "./FavoriteSidebar";
import ChatBody from "./ChatBody";
import Profile from "./Profile.js";
import EditProfile from "./EditProfile";
const ENDPOINT = "http://localhost:5000/";

function Workspace() {
  const [response, setResponse] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [userProfile, setuserProfile] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [show, setShow] = useState(false);

  let chats;
  let currentPage = 0;
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on("retrieve chats", (response) => {
      setResponse(response);
    });

    // socket.on("retrieve messages", (response) => {
    //   setChatMessages((chatMessages) => [...chatMessages, response]);
    //   console.log("messages", response);
    // });
    currentPage = currentPage + 1;
    socket.emit("get messages", { id: clicked, page: currentPage });
  }, [ENDPOINT]);

  let my_uid = response.my_uid;

  return (
    <div className="layout">
      <EditProfile show={show} handleClose={setShow} />
      <Navigator
        my_uid={my_uid}
        setuserProfile={setuserProfile}
        setEditProfile={setShow}
      />
      <div className="content">
        <div className="sidebar-group">
          <ChatSidebar
            clicked={clicked}
            setClicked={setClicked}
            response={response}
          />
          <ArchiveSidebar
            clicked={clicked}
            setClicked={setClicked}
            response={response}
          />
          <FriendSidebar />
          <FavoriteSidebar />
        </div>
        <ChatBody my_uid={my_uid} clicked={clicked} />
        <Profile userProfile={userProfile} />
      </div>
    </div>
  );
}

export default Workspace;
