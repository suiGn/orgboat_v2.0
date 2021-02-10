import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tour from "reactour";
import TourModal from "./Modals/TourModal";
import SidebarIndex from "./Sidebars/index";
import Navigation from "./Navigation";
import Profile from "./Sidebars/Profile";
import Chat from "./Partials/Chat";
import ChatN from "./Partials/ChatNoMessage";
import { pageTourAction } from "../Store/Actions/pageTourAction";
import { profileAction } from "../Store/Actions/profileAction";
import DisconnectedModal from "./Modals/DisconnectedModal";
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "https://www.orgboat.me/";

function Layout(props) {
  const [clicked, setClicked] = useState([]);
  const { pageTour } = useSelector((state) => state);
  const { socket } = props;
  const [user, setUser] = useState("");
  const dispatch = useDispatch();
  const [my_uid, setMy_Id] = useState("");

  useEffect(() => {
    document.querySelector("*").addEventListener("click", (e) => {
      if (
        document.body.classList.contains("navigation-open") &&
        e.target.nodeName === "BODY"
      ) {
        document.body.classList.remove("navigation-open");
      }
    });
    console.log(clicked);
  }, []);

  useEffect(() => {
    props.socket.on("my_uid response", (data) => {
      setMy_Id({ id: data.id });
    });
  });

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
          socket={props.socket}
          setUser={setUser}
          my_uid={my_uid}
          data={clicked}
        />
        <SidebarIndex
          socket={socket}
          setClicked={setClicked}
          setUser={setUser}
          my_uid={my_uid}
        />
        {clicked.name ? (
          <Chat
            darkSwitcherTooltipOpen={props.darkSwitcherTooltipOpen}
            socket={socket}
            clicked={clicked}
            setUser={setUser}
            my_uid={my_uid}
          />
        ) : (
          <ChatN />
        )}

        <Profile socket={socket} user={user} />
        <TourModal />
        <DisconnectedModal />
      </div>
    </div>
  );
}

export default Layout;
