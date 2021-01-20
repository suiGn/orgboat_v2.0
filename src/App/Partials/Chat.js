import React, {useEffect, useState} from 'react'
import ChatHeader from "./ChatHeader"
import ChatFooter from "./ChatFooter"
import ManAvatar3 from "../../assets/img/man_avatar3.jpg"
import {selectedChat} from "../Sidebars/Chats/Data"
import PerfectScrollbar from "react-perfect-scrollbar"
import UnselectedChat from '../../assets/img/unselected-chat.svg'

function Chat() {

    const [inputMsg, setInputMsg] = useState('');

    const [messages, setMessages] = useState(selectedChat);

    const [scrollEl, setScrollEl] = useState();

    useEffect(() => {
        if (scrollEl) {
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
    }, [scrollEl]);

    const handleSubmit = (newValue) => {
        setMessages(prevState => {
            return [
                ...prevState,
                newValue
            ];
        });

        setTimeout(function () {
            if (scrollEl) {
                scrollEl.scrollTop = scrollEl.scrollHeight;
            }
        }, 200);

        setInputMsg("");

        setTimeout(() => {

            setMessages(prevState => {
                return [
                    ...prevState,
                    {
                        name: 'Byrom Guittet',
                        avatar: <figure className="avatar">
                            <img src={ManAvatar3} className="rounded-circle" alt="avatar"/>
                        </figure>,
                        text: 'I sent you all the files. Good luck with 😃',
                        date: '2 seconds ago',
                    }
                ];
            });

            setTimeout(function () {
                if (scrollEl) {
                    scrollEl.scrollTop = scrollEl.scrollHeight;
                }
            }, 200)

        }, 1000);
    };

    const handleChange = (newValue) => {
        setInputMsg(newValue);
    };

    const MessagesView = (props) => {
        const {message} = props;

        if (message.type === 'divider') {
            return <div className="message-item messages-divider sticky-top" data-label={message.text}></div>
        } else {
            return <div className={"message-item " + message.type}>
                <div className="message-avatar">
                    {message.avatar}
                    <div>
                        <h5>{message.name}</h5>
                        <div className="time">
                            {message.date}
                            {message.type ? <i className="ti-double-check text-info"></i> : null}
                        </div>
                    </div>
                </div>
                {
                    message.media
                        ?
                        message.media
                        :
                        <div className="message-content">
                            {message.text}
                        </div>
                }
            </div>
        }
    };

    return (
        <div className="chat">
            <ChatHeader/>
            <PerfectScrollbar containerRef={ref => setScrollEl(ref)}>
                <div className="chat-body">
                    <div className="messages">
                        {
                            messages.map((message, i) => <MessagesView message={message} key={i}/>)
                        }
                    </div>
                </div>
            </PerfectScrollbar>
            <ChatFooter onSubmit={handleSubmit} onChange={handleChange} inputMsg={inputMsg}/>
        </div>
    )
}

export default Chat
