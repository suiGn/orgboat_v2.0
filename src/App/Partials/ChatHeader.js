import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FeatherIcon from "react-feather";
import VoiceCallModal from "../Modals/VoiceCallModal";
import VideoCallModal from "../Modals/VideoCallModal";
import { profileAction } from "../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../Store/Actions/mobileProfileAction";
import ManAvatar3 from "../../assets/img/man_avatar3.jpg";

function ChatHeader(props) {
  const dispatch = useDispatch();

  const { socket } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const mobileMenuBtn = () => document.body.classList.toggle("navigation-open");

  const profileActions = () => {
    props.setUser({ id: props.id });
    dispatch(profileAction(true));
    dispatch(mobileProfileAction(true));
  };
  let p;
  let chat_initial;
  let chat_name;
  if (props.data.pphoto === "" || props.data.pphoto === null) {
    chat_name = props.data.name;
    chat_initial = chat_name.substring(0, 1);
    p = (
      <span className="avatar-title bg-info rounded-circle">
        {chat_initial}
      </span>
    );
  } else {
    p = <img src={props.data.pphoto} className="rounded-circle" alt="image" />;
  }

  function ArchiveChat(chat_selected) {
    socket.emit("archived chat", { chat: chat_selected });
    socket.once("archived response", function () {
      socket.emit("get chats");
      socket.emit("get chats archived");
    });
  }

  return (
    <div className="chat-header">
      <div className="chat-header-user">
        <figure className="avatar">{p}</figure>
        <div>
          <h5>{props.data.name}</h5>
          {/* <small className="text-success">
            <i>writing...</i>
          </small> */}
        </div>
      </div>
      <div className="chat-header-action">
        <ul className="list-inline">
          <li className="list-inline-item d-xl-none d-inline">
            <button
              onClick={mobileMenuBtn}
              className="btn btn-outline-light mobile-navigation-button"
            >
              <FeatherIcon.Menu />
            </button>
          </li>
          {/* <li className="list-inline-item">
            <VoiceCallModal />
          </li>
          <li className="list-inline-item">
            <VideoCallModal />
          </li> */}
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            title="Video call"
          >
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
              >
                <button className="btn btn-outline-light">
                  <FeatherIcon.MoreHorizontal />
                </button>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={profileActions}>Profile</DropdownItem>
                <DropdownItem onClick={() => ArchiveChat(props.chat_uid)}>
                  Add to archive
                </DropdownItem>
                <DropdownItem>Delete</DropdownItem>
                {/* <DropdownItem divider />
                <DropdownItem>Block</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ChatHeader;
