import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from "react-redux"
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import FavoritesDropdown from "./FavoritesDropdown"
//import {favoriteChats} from "./Data"
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction"
import * as FeatherIcon from "react-feather"

function Index(props) {
    const {socket} =  props
    const [favoriteChats, setfavoriteChats] = useState([]);
    useEffect(() => {
        inputRef.current.focus();
        socket.emit('GetFavorites', props.my_uid);
        socket.on ('retrieve getfavorites', function (data) {
            setfavoriteChats(data.favorites)
        });
    },[props]);

    const inputRef = useRef();

    const dispatch = useDispatch();

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    return (
        <div className="sidebar active">
            <header>
                <span>Favorites</span>
                <ul className="list-inline">
                    <li className="list-inline-item d-xl-none d-inline">
                        <button onClick={mobileSidebarClose}
                                className="btn btn-outline-light text-danger sidebar-close">
                            <FeatherIcon.X/>
                        </button>
                    </li>
                </ul>
            </header>
            <form>
                <input type="text" className="form-control" placeholder="Search favorites" ref={inputRef}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            favoriteChats.map((item, i) => {
                                return <li key={i} className="list-group-item">
                                    <div className="users-list-body">
                                        <div>
                                            <h5>{item.name}</h5>
                                            {item.message}
                                        </div>
                                        <div className="users-list-action">
                                            <div className="action-toggle">
                                                <FavoritesDropdown/>
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
