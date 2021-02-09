import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FeatherIcon from "react-feather";
import { profileAction } from "../../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../../Store/Actions/mobileProfileAction";
import { useDispatch } from "react-redux";

const ChatsMessageDropdown = (props) => {
  const dispatch = useDispatch();
  const { socket } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const profileActions = () => {
    dispatch(profileAction(true));
    dispatch(mobileProfileAction(true));
  };

  function AddFavorite(message_id) {
    socket.emit("FavoriteMessage", { id: message_id });
   socket.emit("get messages", { id: props.chat_id, page: 1 });
  }

  function RemoveFavorite(message_id) {
    socket.emit("RemoveFavorite", { id: message_id });
    socket.emit("get messages", { id: props.chat_id, page: 1 });
  }

  function DeleteMessage(message_id){
    props.message.chat_type == 1? DeleteMGrupo(message_id):DeleteMChat(message_id)
    //socket.emit("Delete message", { id: message_id });
    //socket.emit("get messages", { id: props.chat_id, page: 1 });
  }

  const DeleteMGrupo = (message_id)=>{
    (props.message.message_user_uid == props.prop_id)?
    console.log("es mio"):
    console.log("no es mio")
  }

  const DeleteMChat = (message_id)=>{
    socket.emit("Delete message", { id: message_id, user_id: props.my_uid.id });
    socket.emit("get messages", { id: props.chat_id, page: 1 });
  }


 
  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="dropdown-chat-message"
    >
      <DropdownToggle tag="span">
        <FeatherIcon.ChevronDown />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => DeleteMessage(props.message.message_id)}>Delete</DropdownItem>
        {
          (props.message.chat_type == 1)?
          (props.message.message_user_uid != props.prop_id && !props.message.favorite)?
          <DropdownItem onClick={() => AddFavorite(props.message.message_id)}>Favorite</DropdownItem>:""
          :
          (props.message.message_user_uid == props.prop_id && !props.message.favorite)?
          <DropdownItem onClick={() => AddFavorite(props.message.message_id)}>Favorite</DropdownItem>:""
        }
        { (props.message.chat_type == 1)?
          (props.message.message_user_uid != props.prop_id && props.message.favorite)?
          <DropdownItem onClick={() => RemoveFavorite(props.message.message_id)}>Remove Favorite</DropdownItem>:""
          :
          (props.message.message_user_uid == props.prop_id && props.message.favorite)?
          <DropdownItem onClick={() => RemoveFavorite(props.message.message_id)}>Remove Favorite</DropdownItem>:""
        }
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatsMessageDropdown;
