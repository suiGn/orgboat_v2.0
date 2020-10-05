import React from "react";
import empty from "../svg/undraw_empty_xct9.svg";
// import '../css/orgboat/normalize.css'


export default class ChatBodyNoMessage extends React.Component{
  render(){
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
    </div>
    <div className="chat-footer"></div>
  </div>
  );
}
}





