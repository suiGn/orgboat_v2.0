import React, {useState} from 'react'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import * as FeatherIcon from 'react-feather'
import {profileAction} from "../../../Store/Actions/profileAction";
import {mobileProfileAction} from "../../../Store/Actions/mobileProfileAction";
import { userProfileAction } from "../../../Store/Actions/userProfileAction";
import { mobileUserProfileAction } from "../../../Store/Actions/mobileUserProfileAction";
import {useDispatch} from "react-redux";

const ChatsDropdown = (props) => {

    const dispatch = useDispatch();
    const {socket} = props;

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
    function DeleteChat(idchat) {
        socket.emit("Delete Chat", { chat_uid: idchat });
        socket.once("retrive delete chat", () => {
          socket.emit("get chats");
        });
    }

    const profileActions = () => {
        props.setUser({id:props.id});
        dispatch(userProfileAction(true));
        dispatch(mobileUserProfileAction(true));
    };

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="span">
                <FeatherIcon.MoreHorizontal/>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={profileActions}>Profile</DropdownItem>
                {/* <DropdownItem onClick={() => DeleteChat(props.chat_uid)}>Delete</DropdownItem> */}
            </DropdownMenu>
        </Dropdown>
    )
};

export default ChatsDropdown
