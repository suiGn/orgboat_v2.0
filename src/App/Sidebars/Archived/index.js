import React, {useEffect, useRef} from 'react'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ArchivedDropdown from "./ArchivedDropdown"
import {useDispatch} from "react-redux"
import {archivedChats} from "./Data"
import {mobileSidebarAction} from "../../../Store/Actions/mobileSidebarAction"
import * as FeatherIcon from "react-feather"

function Index() {

    useEffect(() => {
        inputRef.current.focus();
    });

    const dispatch = useDispatch();

    const inputRef = useRef();

    const mobileSidebarClose = () => {
        dispatch(mobileSidebarAction(false));
        document.body.classList.remove('navigation-open');
    };

    return (
        <div className="sidebar active">
            <header>
                <span>Archived</span>
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
                <input type="text" className="form-control" placeholder="Search archived" ref={inputRef}/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            archivedChats.map((chat, i) => {
                                return <li key={i} className="list-group-item">
                                    {chat.avatar}
                                    <div className="users-list-body">
                                        <div>
                                            <h5>{chat.name}</h5>
                                            <p>{chat.title}</p>
                                        </div>
                                        <div className="users-list-action">
                                            <div className="action-toggle">
                                                <ArchivedDropdown/>
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
