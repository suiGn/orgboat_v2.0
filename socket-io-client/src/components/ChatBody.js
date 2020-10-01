import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import empty from "../svg/undraw_empty_xct9.svg";
import $ from "jquery";
const ENDPOINT = "http://127.0.0.1:5000";

function ChatBody(props) {
  const [response, setChatMessage] = useState([]);
  let messages;
  let my_uid;
  let currentPage = 0;

  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.emit("get messages");
  //   socket.on("retrieve messages", { id:  $(this).attr("i"), page: currentPage + 1 }, (response) => {
  //     setChatMessage(response);
  //     // console.log(response);
  //   });
  // })



  // messages = response.chats;
  // my_uid = response.my_uid;
  // console.log("Respuesta", response);
  return (
    <div>
      <div className="chat-header">
        <div className="chat-header-action">
          <ul className="list-inline" id="conversation-opts"></ul>
        </div>
      </div>
      <div className="chat-body ">
        <div id="nochatselected">
          <div className="no-message-container custom-chat-message">
            <div className="row mb-5 chat-body-custom">
              <div className="col-md-4 offset-4 ">
                <img src={empty} className="img-fluid " alt="image" />
              </div>
            </div>
            <p className="lead">Welcome to OrgBoat!</p>
          </div>
        </div>

        {/* <div className="messages">
          <div class="message-item ${out}">
            ${usrname}
            <div class="message-content">
              <a href="#" class="btn btn-outline-light" data-toggle="dropdown">
                <i class="fa fa-ellipsis-h"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a
                  href="#"
                  class="dropdown-item"
                  // onclick="DeleteChat('${chat_selected}')"
                >
                  Delete
                </a>
              </div>
              message.message
              <div class="message-avatar">
                <div>
                  <div class="time">
                    ${timeSend} ${ticks}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="chat-footer"></div>
    </div>
  );
}

export default ChatBody;
