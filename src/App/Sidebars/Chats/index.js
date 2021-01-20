import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from "react-redux"
import * as FeatherIcon from 'react-feather'
import {Tooltip} from 'reactstrap'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddGroupModal from "../../Modals/AddGroupModal"
import ChatsDropdown from "./ChatsDropdown"
import {sidebarAction} from "../../../Store/Actions/sidebarAction"
import {chatLists} from "./Data";
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction";

function Index() {

    useEffect(() => {
        inputRef.current.focus();
    });

    const dispatch = useDispatch();

    const inputRef = useRef();

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    const ChatListView = (props) => {
        const {chat} = props;

        return <li className={"list-group-item " + (chat.selected ? 'open-chat' : '')}>
            {chat.avatar}
            <div className="users-list-body">
                <div>
                    <h5 className={chat.unread_messages ? 'text-primary' : ''}>{chat.name}</h5>
                    {chat.text}
                </div>
                <div className="users-list-action">
                    {chat.unread_messages ? <div className="new-message-count">{chat.unread_messages}</div> : ''}
                    <small className={chat.unread_messages ? 'text-primary' : 'text-muted'}>{chat.date}</small>
                    <div className="action-toggle">
                        <ChatsDropdown/>
                    </div>
                </div>
            </div>
        </li>
    };

    return (
        <div className="sidebar active">
            <header>
                <span>Chats</span>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <AddGroupModal/>
                    </li>
                    <li className="list-inline-item">
                        <button onClick={() => dispatch(sidebarAction('Friends'))} className="btn btn-outline-light"
                                id="Tooltip-New-Chat">
                            <FeatherIcon.PlusCircle/>
                        </button>
                        <Tooltip
                            placement="bottom"
                            isOpen={tooltipOpen}
                            target={"Tooltip-New-Chat"}
                            toggle={toggle}>
                            New chat
                        </Tooltip>
                    </li>
                    <li className="list-inline-item d-xl-none d-inline">
                        <button onClick={mobileSidebarClose}
                                className="btn btn-outline-light text-danger sidebar-close">
                            <FeatherIcon.X/>
                        </button>
                    </li>
                </ul>
            </header>
            <form>
                <input type="text" className="form-control" placeholder="Search chats" ref={inputRef}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            chatLists.map((chat, i) => <ChatListView chat={chat} key={i}/>)
                        }
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    )
}

export default Index
