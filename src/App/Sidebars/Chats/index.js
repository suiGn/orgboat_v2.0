import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from "react-redux"
import * as FeatherIcon from 'react-feather'
import {Tooltip} from 'reactstrap'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddGroupModal from "../../Modals/AddGroupModal"
import ChatsDropdown from "./ChatsDropdown"
import {sidebarAction} from "../../../Store/Actions/sidebarAction"
// import {chatLists} from "./Data";
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction";

function Index(props) {
    const {socket} =  props
    const[chatLists,setChatList] =  useState([]);
    const [favoriteFriendFiltered, setfavoriteFriendFiltered] = useState([]);
    const [searchFavorite, setSearchFavorite] = useState("");
    useEffect(() => {
        inputRef.current.focus();
        socket.on("retrieve chats",(data)=>{
            setChatList(data);
            setfavoriteFriendFiltered(data.chats);
        });
    });
    useEffect(()=>{
        socket.emit("get chats");
    },[]);
    useEffect(()=>{
        console.log(chatLists);
    },[chatLists]);


    const dispatch = useDispatch();

    const inputRef = useRef();

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    function timeformat(date) {
        var h = date.getHours();
        var m = date.getMinutes();
        var x = h >= 12 ? "PM" : "AM";
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? "0" + m : m;
        var mytime = h + ":" + m + " " + x;
        return mytime;
    }
    
    function getDateLabel(date) {
        let dateLabelDate =
          date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let dateLabelMonth =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        let dateLabelYear = date.getFullYear();
        let dateLabel = dateLabelDate + "/" + dateLabelMonth + "/" + dateLabelYear;
        return dateLabel;
    }
    let my_uid = chatLists.my_uid;
    const ChatListView = (props) => {
        const {chat} = props;
        let chat_initial;
        let chat_name;
        let p;
        let chat_with_usr = chat.user_chat;
        if(my_uid != chat.user_chat){
            chat_name = chat.name;
            chat_initial = chat_name.substring(0, 1);
            let timeMessage = new Date(chat.last_message_time);
            let timeLabel;
            let today = new Date();
            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (
                timeMessage.getDate() == today.getDate() &&
                timeMessage.getMonth() == today.getMonth() &&
                timeMessage.getFullYear() == today.getFullYear()
            ) {
                timeLabel = timeformat(timeMessage);
            } else if (
                timeMessage.getDate() == yesterday.getDate() &&
                timeMessage.getMonth() == yesterday.getMonth() &&
                timeMessage.getFullYear() == yesterday.getFullYear()
            ) {
                timeLabel = "Yesterday";
            } else {
                timeLabel = getDateLabel(timeMessage);
            }
                //var pphotoUser = new File([""], chat.pphoto);
                //var p = "";
            if (chat.pphoto === "") {
                p = (
                    <span className="avatar-title bg-info rounded-circle">
                        {chat_initial}
                    </span>
                    );
            } else {
                p = (
                    <img
                        src={chat.pphoto}
                        className="rounded-circle"
                        alt="image"
                    />
                );
            }
            return <li className={"list-group-item " + (chat.selected ? 'open-chat' : '')} onClick={() => {props.setClicked(chat);}}>
                <div>
                        <figure className="avatar">{p}</figure>
                </div>
                <div className="users-list-body">
                    <div i={chat.chat_uid}>
                        <h5 className={chat.unread_messages ? 'text-primary' : ''} i={chat.chat_uid}>{chat.name}</h5>
                        {chat.last_message_message}
                    </div>
                    <div className="users-list-action">
                        {chat.unread_messages ? <div className="new-message-count">{chat.unread_messages}</div> : ''}
                        <small className={chat.unread_messages ? 'text-primary' : 'text-muted'}>{timeLabel}</small>
                        <div className="action-toggle">
                            <ChatsDropdown setUser={props.setUser} id={chat.user_chat}/>
                        </div>
                    </div>
                </div>
            </li>
        }
        return ""
    };
    function searchChat(wordToSearch){
        setSearchFavorite(wordToSearch);
        var resultFavorits = chatLists.filter((val) => {
            return val.message.toLowerCase().includes(wordToSearch.toLowerCase());
        });
        setfavoriteFriendFiltered(resultFavorits);
    }

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
                <input type="text" className="form-control" placeholder="Search chats" ref={inputRef} value={searchFavorite}  onChange={(e) => searchChat(e.target.value)}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            chatLists.chats &&
                            chatLists.chats.map((chat, i) => <ChatListView chat={chat} key={i} setClicked={props.setClicked} setUser={props.setUser}/>)
                        }
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    )
}

export default Index
