import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import ChatsIndex from "./Chats"
import FriendsIndex from "./Friends"
import FavoritesIndex from "./Favorites"
import ArchivedIndex from "./Archived"

function Index(props) {

    const {selectedSidebar, mobileSidebar} = useSelector(state => state);

    return (
        <div className={`sidebar-group ${mobileSidebar ? "mobile-open" : ""}`}>
            {
                (() => {
                    if (selectedSidebar === 'Chats') {
                        return <ChatsIndex socket={props.socket} setClicked ={props.setClicked}/>
                    } else if (selectedSidebar === 'Friends') {
                        return <FriendsIndex socket={props.socket}/>
                    } else if (selectedSidebar === 'Favorites') {
                        return <FavoritesIndex socket={props.socket} user={props.user} />
                    } else if (selectedSidebar === 'Archived') {
                        return <ArchivedIndex socket={props.socket}/>
                    }
                })()
            }
        </div>
    )
}

export default Index
