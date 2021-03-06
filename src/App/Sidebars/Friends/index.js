import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from "react-redux"
import * as FeatherIcon from 'react-feather'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddFriendsModal from "../../Modals/AddFriendModal"
import FriendsDropdown from "./FriendsDropdown"
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction"
// import {friendLists} from "./Data"



function Index(props) {
    const [friendLists, setContact] = useState([]);
    const [favoriteFriendFiltered, setfavoriteFriendFiltered] = useState([]);
    const [searchFavorite, setSearchFavorite] = useState("");
    useEffect(() => {
        inputRef.current.focus();
    });
    let my_uid

    const {socket} =  props

    const inputRef = useRef();

    const dispatch = useDispatch();

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    function RetriveGetContacts(contacts){
        var chats = contacts.chats.filter((chats)=>{
            return chats.chat_type == 0;
          })
        contacts.chats = chats;
        setContact(contacts);
        setfavoriteFriendFiltered(chats);
    }

    useEffect(() => {
        socket.on("retrive GetContacts",RetriveGetContacts);
        return () => {
            socket.off("retrieve GetContacts", RetriveGetContacts);
        };
    });

    useEffect(()=>{
        socket.emit("GetContacts");
    },[]);
    
    function searchFav(wordToSearch){
        setSearchFavorite(wordToSearch);
        var resultFavorits = friendLists.chats.filter((val) => {
            return val.name.toLowerCase().includes(wordToSearch.toLowerCase());
          });
          setfavoriteFriendFiltered(resultFavorits);
    }

    return (
        <div className="sidebar active">
            <header>
                <span>Friends</span>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <AddFriendsModal socket={props.socket}  my_uid={props.my_uid}/>
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
                <input type="text" className="form-control" placeholder="Search friends" ref={inputRef}  value={searchFavorite}  onChange={(e) => searchFav(e.target.value)}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            friendLists.chats && 
                            favoriteFriendFiltered.map((item, i) => {
                                let my_uid = friendLists.my_uid;
                                if(my_uid == item.user_chat){
                                    return ""
                                }
                                let chat_name = item.name;
                                let p;
                                let chat_initial = chat_name.substring(0, 1);
                                if (item.pphoto === "" ||item.pphoto === null) {
                                    p = (
                                    <span className="avatar-title bg-info rounded-circle">
                                        {chat_initial}
                                    </span>
                                    );
                                } else {
                                    p = (
                                    <img
                                        src={item.pphoto}
                                        className="rounded-circle"
                                        alt="image"
                                    />
                                    );
                                }
                                return <li key={i} className="list-group-item">
                                    <figure className="avatar">
                                        {p}
                                    </figure>
                                    <div className="users-list-body">
                                        <div>
                                            <h5>{item.name}</h5>
                                            {/* <p>{item.title}</p> */}
                                        </div>
                                        <div className="users-list-action">
                                            <div className="action-toggle">
                                                <FriendsDropdown setUser={props.setUser} id={item.user_chat}/>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    )
}

export default Index
