import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tour from "reactour";
import TourModal from "./Modals/TourModal";
import SidebarIndex from "./Sidebars/index";
import Navigation from "./Navigation";
import Profile from "./Sidebars/Profile";
import UserProfile from "./Sidebars/UserProfile";
import ProfileGroup from "./Sidebars/ProfileGroup";
import Chat from "./Partials/Chat";
import ChatN from "./Partials/ChatNoMessage";
import { pageTourAction } from "../Store/Actions/pageTourAction";
import { profileAction } from "../Store/Actions/profileAction";
import DisconnectedModal from "./Modals/DisconnectedModal";
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:5000/";

function Layout(props) {
  const [clicked, setClicked] = useState([]);
  const { pageTour } = useSelector((state) => state);
  const { socket } = props;
  const [user, setUser] = useState("");
  const [group, setGroup] = useState("");
  const dispatch = useDispatch();
  const [my_uid, setMy_Id] = useState("");
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openGroupProfile, setOpenGroupProfile] = useState(false);

  useEffect(() => {
    document.querySelector("*").addEventListener("click", (e) => {
      if (
        document.body.classList.contains("navigation-open") &&
        e.target.nodeName === "BODY"
      ) {
        document.body.classList.remove("navigation-open");
      }
    });
  }, []);

  useEffect(() => {
    props.socket.once("my_uid response", (data) => {
      setMy_Id({ id: data.user[0].u_id });
    });
  }, [my_uid]);

  const tourSteps = [
    {
      selector: "#Tooltip-New-Chat",
      content: "You can create a new chat here.",
    },
    {
      selector: "#Tooltip-Add-Group",
      content: "You can start a new group to chat with all your friends.",
    },
    {
      selector: "#Tooltip-2",
      content:
        "Layout and messages you've added to your favorites appear here.",
    },
    {
      selector: "#Tooltip-3",
      content: "Layout and messages you've archived appear here.",
    },
    {
      selector: "#Tooltip-Voice-Call",
      content: "Start voice call from here.",
    },
    {
      selector: "#Tooltip-Video-Call",
      content: "Start a video call from here.",
    },
    {
      selector: "#user-menu",
      content: "Here you can manage your personal information and settings.",
    },
  ];

  return (
    <div className="layout">
      <Tour
        steps={tourSteps}
        isOpen={pageTour}
        onRequestClose={() => dispatch(pageTourAction(false))}
      />
      <div className="content">
        <Navigation
          darkSwitcherTooltipOpen={props.darkSwitcherTooltipOpen}
          setDarkSwitcherTooltipOpen={props.setDarkSwitcherTooltipOpen}
          socket={socket}
          setUser={setUser}
          setOpenProfile={setOpenProfile}
          openProfile={openProfile}
          openUserProfile={openUserProfile}
          setOpenUserProfile={setOpenUserProfile}
          openGroupProfile={openGroupProfile}
          setOpenGroupProfile={setOpenGroupProfile}
          my_uid={my_uid}
          data={clicked}
        />
        <SidebarIndex
          socket={socket}
          setClicked={setClicked}
          setUser={setUser}
          setGroup={setGroup}
          my_uid={my_uid}
          setOpenProfile={setOpenProfile}
          openProfile={openProfile}
          openUserProfile={openUserProfile}
          setOpenUserProfile={setOpenUserProfile}
          openGroupProfile={openGroupProfile}
          setOpenGroupProfile={setOpenGroupProfile}
        />
        <Chat
          darkSwitcherTooltipOpen={props.darkSwitcherTooltipOpen}
          socket={socket}
          clicked={clicked}
          setUser={setUser}
          setGroup={setGroup}
          setOpenUserProfile={setOpenUserProfile}
          openUserProfile={openUserProfile}
          setOpenProfile={setOpenProfile}
          openProfile={openProfile}
          openGroupProfile={openGroupProfile}
          setOpenGroupProfile={setOpenGroupProfile}
          my_uid={my_uid}
        />
        <Profile
          setOpenProfile={setOpenProfile}
          openProfile={openProfile}
          openUserProfile={openUserProfile}
          setOpenUserProfile={setOpenUserProfile}
          openGroupProfile={openGroupProfile}
          setOpenGroupProfile={setOpenGroupProfile}
          socket={socket}
          user={user}
        />
        <UserProfile
          openUserProfile={openUserProfile}
          setOpenUserProfile={setOpenUserProfile}
          setOpenProfile={setOpenProfile}
          openProfile={openProfile}
          openGroupProfile={openGroupProfile}
          setOpenGroupProfile={setOpenGroupProfile}
          socket={socket}
          user={user}
        />
        <ProfileGroup 
        openUserProfile={openUserProfile}
        setOpenUserProfile={setOpenUserProfile}
        setOpenProfile={setOpenProfile}
        openProfile={openProfile}
        openGroupProfile={openGroupProfile}
        setOpenGroupProfile={setOpenGroupProfile}
        socket={socket} 
        group={group}/>
        <TourModal />
        <DisconnectedModal />
      </div>
    </div>
  );
}

export default Layout;
