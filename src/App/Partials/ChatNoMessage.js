import React,  { useEffect } from "react";
import empty from "../../assets/img/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
function ChatNoMessage(props) {
  const { socket } = props;
  const mobileMenuBtn = () => document.body.classList.toggle("navigation-open");
  
  useEffect(() => {
    socket.on("chat message", (data) => {
      socket.emit("get chats");
    });
  })
  return (
    <div className="chat">
      <div className="chat-header justify-content-end">
        <div className="chat-header-action">
          <ul className="list-inline">
            <li className="list-inline-item d-xl-none d-inline">
              <button
                onClick={mobileMenuBtn}
                className="btn btn-outline-light mobile-navigation-button"
              >
                <Menu />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-body ">
        <div
          id="nochatselected"
          className="justify-content-center align-items-center d-flex h-100"
        >
          <div className="no-message-container custom-chat-message">
            <div className="row mb-5 chat-body-custom">
              <div className="col-12 text-center">
                <img src={empty} width="400px" className="" alt="image" />
              </div>
            </div>
            <p className="lead text-center">Welcome to OrgBoat!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChatNoMessage;
