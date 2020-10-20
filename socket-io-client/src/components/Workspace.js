import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Navigator from "./Navigator.js";
import ChatSidebar from "./ChatSidebar";
import ArchiveSidebar from "./ArchiveSidebar";
import FriendSidebar from "./FriendSidebar";
import FavoriteSidebar from "./FavoriteSidebar";
import ChatBody from "./ChatBody";
import Profile from "./Profile.js";
const ENDPOINT = "http://127.0.0.1:5000";

function Workspace() {
  const [response, setResponse] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [userProfile, setuserProfile] = useState([]);
  let chats;

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("get chats");
    socket.on("retrieve chats", (response) => {
      setResponse(response);
      // console.log(response);
    });
  }, [ENDPOINT]);

  console.log(clicked);
  let my_uid = response.my_uid;

  return (
    <div className="layout">
      <Navigator my_uid={my_uid} setuserProfile={setuserProfile} />
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
        <ChatBody my_uid={my_uid} clicked={clicked} />
        <Profile userProfile={userProfile} />
      </div>
    </div>
  );
}

export default Workspace;
