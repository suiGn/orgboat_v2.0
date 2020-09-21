import React from "react";
// import logo from "./Images/logo.png";

import Navigator from "./Navigator.js";
import Chat from "./Chat"

function Workspace() {
  return (
      <div className="layout">
          <Navigator/>    
          <div className="content">
              <div className="sidebar-group">
              <Chat/>
              </div>  
          </div>
      </div>

  );
}

export default Workspace;
