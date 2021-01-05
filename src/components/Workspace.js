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
import AddContact from "./AddContact";
const ENDPOINT = "https://www.orgboat.me/";

function Workspace() {
  const [response, setResponse] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [userProfile, setuserProfile] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showContact, setShowContact] = useState(false);

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
    <div>
      <EditProfile
        my_uid={my_uid}
        userProfile={userProfile}
        show={showEditProfile}
      />
      <AddContact my_uid={my_uid} show={showContact} />
      <div className="layout">
        <Navigator
          my_uid={my_uid}
          setuserProfile={setuserProfile}
          setEditProfile={setShowEditProfile}
        />
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
            <FriendSidebar
              setClicked={setClicked}
              setContact={setShowContact}
            />
            <FavoriteSidebar />
          </div>
          <ChatBody
            my_uid={my_uid}
            clicked={clicked}
            setuserProfile={setuserProfile}
          />
          <Profile userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
