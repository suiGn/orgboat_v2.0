import React, {useState} from 'react'
import {useDispatch} from "react-redux"
import {
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import * as FeatherIcon from 'react-feather'
import VoiceCallModal from "../Modals/VoiceCallModal"
import VideoCallModal from "../Modals/VideoCallModal"
import {profileAction} from "../../Store/Actions/profileAction"
import {mobileProfileAction} from "../../Store/Actions/mobileProfileAction";
import ManAvatar3 from "../../assets/img/man_avatar3.jpg";

function ChatHeader() {

    const dispatch = useDispatch();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const mobileMenuBtn = () => document.body.classList.toggle('navigation-open');

    const profileActions = () => {
        dispatch(profileAction(true));
        dispatch(mobileProfileAction(true))
    };

    return (
        <div className="chat-header">
            <div className="chat-header-user">
                <figure className="avatar">
                    <img src={ManAvatar3} className="rounded-circle" alt="avatar"/>
                </figure>
                <div>
                    <h5>Byrom Guittet</h5>
                    <small className="text-success">
                        <i>writing...</i>
                    </small>
                </div>
            </div>
            <div className="chat-header-action">
                <ul className="list-inline">
                    <li className="list-inline-item d-xl-none d-inline">
                        <button onClick={mobileMenuBtn} className="btn btn-outline-light mobile-navigation-button">
                            <FeatherIcon.Menu/>
                        </button>
                    </li>
                    <li className="list-inline-item">
                        <VoiceCallModal/>
                    </li>
                    <li className="list-inline-item">
                        <VideoCallModal/>
                    </li>
                    <li className="list-inline-item" data-toggle="tooltip" title="Video call">
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle
                                tag="span"
                                data-toggle="dropdown"
                                aria-expanded={dropdownOpen}
                            >
                                <button className="btn btn-outline-light">
                                    <FeatherIcon.MoreHorizontal/>
                                </button>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={profileActions}>Profile</DropdownItem>
                                <DropdownItem>Add to archive</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Block</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ChatHeader
