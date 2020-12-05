import React from "react";
import empty from "../svg/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
// import '../css/orgboat/normalize.css'

export default class ChatBodyNoMessage extends React.Component {
  render() {
    return (
      <div>
        <div className="chat-header text-right">
          <div className="chat-header-action w-100">
            {/* id="conversation-opts" */}
            <ul className="list-inline">
              <li className="list-inline-item d-xl-none d-inline">
                <a
                  href="#"
                  className="btn btn-outline-light mobile-navigation-button"
                >
                  <Menu />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="chat-body ">
          <div id="nochatselected">
            <div className="no-message-container custom-chat-message">
              <div className="row mb-5 chat-body-custom">
                <div className="col-12 text-center">
                  <img src={empty} width="400px" className="" alt="image" />
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
