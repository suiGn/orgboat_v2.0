import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import ChatsIndex from "./Chats"
import FriendsIndex from "./Friends"
import FavoritesIndex from "./Favorites"
import ArchivedIndex from "./Archived"
import socketIOClient from "socket.io-client";

function Index(props) {

    const {selectedSidebar, mobileSidebar} = useSelector(state => state);
    const [contact, setContact] = useState([]);
    const socketRef = useRef();
    useEffect(() => {
        console.log("hola");
        socketRef.current =  socketIOClient({
            transports: ['websocket']
        });
        socketRef.current.on("retrive GetContacts", (contacts) => {
            console.log("contacts");
            setContact(contacts);
        });
        return () => {
            socketRef.current.disconnect();
        };
    });

    return (
        <div className={`sidebar-group ${mobileSidebar ? "mobile-open" : ""}`}>
            {
                (() => {
                    if (selectedSidebar === 'Chats') {
                        return <ChatsIndex/>
                    } else if (selectedSidebar === 'Friends') {
                        socketRef.current.emit("GetContacts");
                        return <FriendsIndex socket={props.socket}/>
                    } else if (selectedSidebar === 'Favorites') {
                        return <FavoritesIndex/>
                    } else if (selectedSidebar === 'Archived') {
                        return <ArchivedIndex/>
                    }
                })()
            }
        </div>
    )
}

export default Index
