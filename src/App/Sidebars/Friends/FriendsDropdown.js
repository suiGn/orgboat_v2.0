import React, { useState, useEffect } from "react";
import { profileAction } from "../../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../../Store/Actions/mobileProfileAction";
import { useDispatch } from "react-redux";
import { userProfileAction } from "../../../Store/Actions/userProfileAction";
import { mobileUserProfileAction } from "../../../Store/Actions/mobileUserProfileAction";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FeatherIcon from "react-feather";

const FriendsDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [one, setIOne] = useState("");
  const dispatch = useDispatch();

  const {socket} = props;

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const profileActions = () => {
    props.setUser({ id: props.id });
    dispatch(userProfileAction(true));
    dispatch(mobileUserProfileAction(true));
  };

  // function RetriveNewChat(chat){
  //   console.log(chat.chat_uid);
  // }
  // useEffect(() => {
  //   socket.on("retrive newchat", RetriveNewChat);
  //   return () => {
  //     socket.off("retrive newchat", RetriveNewChat);
  //   };
  // },one);

  const newchat = (chat_uid)=>{
    //console.log(chat_uid);
    socket.emit("newChat",chat_uid);
    socket.once("retrive newchat", (chat)=>{
      console.log({chat_uid:chat.chat_uid});
      props.setClicked({chat_uid:chat.chat_uid});
    });
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag="span">
        <FeatherIcon.MoreHorizontal />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem  onClick={() => newchat(props.chat_uid)}>New chat</DropdownItem>
        <DropdownItem onClick={profileActions}>Profile</DropdownItem>
        {/* <DropdownItem divider/> */}
        {/* <DropdownItem>Block</DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FriendsDropdown;
