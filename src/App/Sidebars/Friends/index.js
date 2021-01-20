import React, {useEffect, useRef, useState} from 'react'
import {useDispatch} from "react-redux"
import * as FeatherIcon from 'react-feather'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddFriendsModal from "../../Modals/AddFriendModal"
import FriendsDropdown from "./FriendsDropdown"
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction"
import {friendLists} from "./Data"



function Index(props) {
  

    useEffect(() => {
        inputRef.current.focus();
    });

    const inputRef = useRef();

    const dispatch = useDispatch();

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    return (
        <div className="sidebar active">
            <header>
                <span>Friends</span>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <AddFriendsModal/>
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
                <input type="text" className="form-control" placeholder="Search friends" ref={inputRef}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            friendLists.map((item, i) => {
                                return <li key={i} className="list-group-item">
                                    {item.avatar}
                                    <div className="users-list-body">
                                        <div>
                                            <h5>{item.name}</h5>
                                            <p>{item.title}</p>
                                        </div>
                                        <div className="users-list-action">
                                            <div className="action-toggle">
                                                <FriendsDropdown/>
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
