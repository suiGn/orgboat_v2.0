import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatsIndex from "./Chats";
import FriendsIndex from "./Friends";
import FavoritesIndex from "./Favorites";
import ArchivedIndex from "./Archived";

function Index(props) {
  const { selectedSidebar, mobileSidebar } = useSelector((state) => state);
  console.log(props);

  return (
    <div className={`sidebar-group ${mobileSidebar ? "mobile-open" : ""}`}>
      {(() => {
        if (selectedSidebar === "Chats") {
          return (
            <ChatsIndex
              socket={props.socket}
              setClicked={props.setClicked}
              setUser={props.setUser}
              setGroup={props.setGroup}
              setOpenProfile={props.setOpenProfile}
              openProfile={props.openProfile}
              openUserProfile={props.openUserProfile}
              setOpenUserProfile={props.setOpenUserProfile}
            />
          );
        } else if (selectedSidebar === "Friends") {
          return (
            <FriendsIndex
              socket={props.socket}
              setClicked={props.setClicked}
              setUser={props.setUser}
              my_uid={props.my_uid}
              setOpenProfile={props.setOpenProfile}
              openProfile={props.openProfile}
              openUserProfile={props.openUserProfile}
              setOpenUserProfile={props.setOpenUserProfile}
            />
          );
        } else if (selectedSidebar === "Favorites") {
          return <FavoritesIndex socket={props.socket} my_uid={props.my_uid} />;
        } else if (selectedSidebar === "Archived") {
          return (
            <ArchivedIndex
              socket={props.socket}
              setUser={props.setUser}
              setOpenProfile={props.setOpenProfile}
              openProfile={props.openProfile}
              openUserProfile={props.openUserProfile}
              setOpenUserProfile={props.setOpenUserProfile}
            />
          );
        }
      })()}
    </div>
  );
}

export default Index;
