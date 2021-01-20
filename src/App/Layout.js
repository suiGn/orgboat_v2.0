import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Tour from 'reactour'
import TourModal from "./Modals/TourModal"
import SidebarIndex from "./Sidebars/index"
import Navigation from "./Navigation"
import Profile from "./Sidebars/Profile"
import Chat from "./Partials/Chat"
import {pageTourAction} from "../Store/Actions/pageTourAction"
import {profileAction} from "../Store/Actions/profileAction";
import DisconnectedModal from "./Modals/DisconnectedModal";

function Layout() {

    const {pageTour} = useSelector(state => state);

    const ui_id = "a8d79038-cdb7-47d6-b9f9-538c7651fb81";
    const dispatch = useDispatch();

    useEffect(() => {
        document.querySelector('*').addEventListener('click', (e) => {
            if (document.body.classList.contains('navigation-open') && e.target.nodeName === 'BODY') {
                document.body.classList.remove('navigation-open')
            }
        });
    }, []);

    const tourSteps = [
        {
            selector: '#Tooltip-New-Chat',
            content: 'You can create a new chat here.',
        },
        {
            selector: '#Tooltip-Add-Group',
            content: 'You can start a new group to chat with all your friends.',
        },
        {
            selector: '#Tooltip-2',
            content: 'Layout and messages you\'ve added to your favorites appear here.',
        },
        {
            selector: '#Tooltip-3',
            content: 'Layout and messages you\'ve archived appear here.',
        },
        {
            selector: '#Tooltip-Voice-Call',
            content: 'Start voice call from here.',
        },
        {
            selector: '#Tooltip-Video-Call',
            content: 'Start a video call from here.',
        },
        {
            selector: '#user-menu',
            content: 'Here you can manage your personal information and settings.',
        }
    ];

    return (
        <div className="layout">
            <Tour
                steps={tourSteps}
                isOpen={pageTour}
                onRequestClose={() => dispatch(pageTourAction(false))}
            />
            <div className="content">
                <Navigation/>
                <SidebarIndex/>
                <Chat/>
                <Profile ui_id={ui_id}/>
                <TourModal/>
                <DisconnectedModal/>
            </div>
        </div>
    )
}

export default Layout
