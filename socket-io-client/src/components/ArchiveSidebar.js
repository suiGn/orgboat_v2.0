import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";

function ArchiveSidebar(props, clicked) {
  const [archive, setUnarchive] = useState([]);
  let chats = props.response.chats;

  let my_uid = props.response.my_uid;
  console.log("Respuesta", props);
  function timeformat(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var x = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? "0" + m : m;
    var mytime = h + ":" + m + " " + x;
    return mytime;
  }

  function getDateLabel(date) {
    let dateLabelDate =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let dateLabelMonth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let dateLabelYear = date.getFullYear();
    let dateLabel = dateLabelDate + "/" + dateLabelMonth + "/" + dateLabelYear;
    return dateLabel;
  }

  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);
  //   socket.emit("get chats archived");
  //   socket.on("retrieve chats archived", (response) => {
  //     set(response);
  //     // console.log(response);
  //   });
  // }, [ENDPOINT]);

  // console.log(archive);
  // function ChatArchive(user) {
  //     //console.log(user);
  //     var socket = io();
  //     socket.emit("get chats archived");
  //     socket.on("retrieve chats archived", function (data) {
  //       var my_uid = data.my_uid;
  //       var chats = data.chats;
  //       chatlist(my_uid, chats, "#chats-archive-list", 0, "Unarchive");
  //     });
  //   }

  function Unarchive(chat_selected) {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("Unarchive chat", { chat: chat_selected });
    socket.on("Unarchive response", function (data) {
      // ChatArchive();
      // setUnarchive
    });
  }

  return (
    <div id="archived" className="sidebar">
      <header>
        <span>Archived</span>
        <ul className="list-inline">
          <li className="list-inline-item d-xl-none d-inline">
            <a
              href="#"
              className="btn btn-outline-light text-danger sidebar-close"
            >
              <i data-feather="x" />
            </a>
          </li>
        </ul>
      </header>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder="Search archived"
        />
      </form>
      <div className="sidebar-body">
        <ul className="list-group list-group-flush users-list">
          {chats &&
            chats.map((chat) => {
              if (
                chat.chat_type == 0 &&
                chat.archiveChat == 1 &&
                chat.delete_chat == 0
              ) {
                let chat_initial;
                let chat_name;
                let p;
                let chat_with_usr = chat.user_chat;
                if (my_uid != chat.user_chat) {
                  chat_name = chat.name;
                  chat_initial = chat_name.substring(0, 1);
                  let timeMessage = new Date(chat.last_message_time);
                  let timeLabel;
                  let today = new Date();
                  let yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  if (
                    timeMessage.getDate() == today.getDate() &&
                    timeMessage.getMonth() == today.getMonth() &&
                    timeMessage.getFullYear() == today.getFullYear()
                  ) {
                    timeLabel = timeformat(timeMessage);
                  } else if (
                    timeMessage.getDate() == yesterday.getDate() &&
                    timeMessage.getMonth() == yesterday.getMonth() &&
                    timeMessage.getFullYear() == yesterday.getFullYear()
                  ) {
                    timeLabel = "Yesterday";
                  } else {
                    timeLabel = getDateLabel(timeMessage);
                  }
                  if (chat.pphoto === "") {
                    p = (
                      <span className="avatar-title bg-info rounded-circle">
                        {chat_initial}
                      </span>
                    );
                  } else {
                    p = (
                      <img
                        src={"/pphotoChat/" + chat_name}
                        className="rounded-circle"
                        alt="image"
                      />
                    );
                  }
                  return (
                    <li
                      className={
                        clicked === chat.chat_uid && "is-active"
                          ? "list-group-item chat-conversation-select chat-is-active"
                          : "list-group-item chat-conversation-select"
                      }
                      key={chat.chat_uid}
                      i={chat.chat_uid}
                      n={chat_name}
                      t={timeMessage.getTime()}
                      u={chat_with_usr}
                      onClick={() => {
                        props.setClicked(chat.chat_uid);
                      }}
                    >
                      <div>
                        <figure className="avatar">{p}</figure>
                      </div>
                      <div className="users-list-body">
                        <div>
                          <h5 className="last-message-user" i={chat.chat_uid}>
                            {chat_name}
                          </h5>
                          <p className="last-message-chat" i={chat.chat_uid}>
                            {chat.last_message_message}
                          </p>
                        </div>
                        <div className="users-list-action">
                          <div
                            className="new-message-count d-none"
                            i={chat.chat_uid}
                          ></div>
                          <small
                            className="text-muted last-message-time"
                            i={chat.chat_uid}
                          >
                            {timeLabel} 111
                          </small>
                          <div className="action-toggle">
                            <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                <i className="ti-more-alt"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                <a href="#" className="dropdown-item">
                                  Open
                                </a>
                                <button
                                  //   onClick="profiledata('${
                                  //   chat.chat_uid
                                  // }')"
                                  data-navigation-target="contact-information"
                                  className="dropdown-item"
                                >
                                  Profile
                                </button>
                                <a
                                  href="#"
                                  onClick={() => Unarchive(chat.chat_uid)}
                                  className="dropdown-item"
                                >
                                  Unarchive
                                </a>
                                <div className="dropdown-divider"></div>
                                <a
                                  href="#"
                                  className="dropdown-item text-danger"
                                  //   onclick="DeleteChat('${
                                  //   chat.chat_uid
                                  // }')"
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }
              }
            })}
        </ul>
      </div>
    </div>

    // <div id="friends" className="sidebar">
    //   <header>
    //     <span>Friends</span>
    //     <ul className="list-inline">
    //       <li
    //         className="list-inline-item"
    //         data-toggle="tooltip"
    //         title="Add friends"
    //       >
    //         <a
    //           className="btn btn-outline-light"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#addFriends"
    //         >
    //           <i data-feather="user-plus" />
    //         </a>
    //       </li>
    //       <li className="list-inline-item d-xl-none d-inline">
    //         <a
    //           href="#"
    //           className="btn btn-outline-light text-danger sidebar-close"
    //         >
    //           <i data-feather="x" />
    //         </a>
    //       </li>
    //     </ul>
    //   </header>
    //   <form>
    //     <input
    //       type="text"
    //       className="form-control"
    //       placeholder="Search friends"
    //     />
    //   </form>
    //   <div className="sidebar-body">
    //     <ul className="list-group list-group-flush">
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Harrietta Souten</h5>
    //             <p>Dental Hygienist</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-warning">
    //             <span className="avatar-title bg-success rounded-circle">
    //               A
    //             </span>
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Aline McShee</h5>
    //             <p>Marketing Assistant</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-success">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Brietta Blogg</h5>
    //             <p>Actuary</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-success">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Karl Hubane</h5>
    //             <p>Chemical Engineer</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Jillana Tows</h5>
    //             <p>Project Manager</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-success">
    //             <span className="avatar-title bg-info rounded-circle">AD</span>
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Alina Derington</h5>
    //             <p>Nurse</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-secondary">
    //             <span className="avatar-title bg-warning rounded-circle">
    //               S
    //             </span>
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Stevy Kermeen</h5>
    //             <p>Associate Professor</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Stevy Kermeen</h5>
    //             <p>Senior Quality Engineer</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar">
    //             <img
    //               src="http://via.placeholder.com/128X128"
    //               className="rounded-circle"
    //               alt="image"
    //             />
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Gloriane Shimmans</h5>
    //             <p>Web Designer</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li className="list-group-item" data-navigation-target="chats">
    //         <div>
    //           <figure className="avatar avatar-state-warning">
    //             <span className="avatar-title bg-secondary rounded-circle">
    //               B
    //             </span>
    //           </figure>
    //         </div>
    //         <div className="users-list-body">
    //           <div>
    //             <h5>Bernhard Perrett</h5>
    //             <p>Software Engineer</p>
    //           </div>
    //           <div className="users-list-action">
    //             <div className="action-toggle">
    //               <div className="dropdown">
    //                 <a data-toggle="dropdown" href="#">
    //                   <i data-feather="more-horizontal" />
    //                 </a>
    //                 <div className="dropdown-menu dropdown-menu-right">
    //                   <a href="#" className="dropdown-item">
    //                     New chat
    //                   </a>
    //                   <a
    //                     href="#"
    //                     data-navigation-target="contact-information"
    //                     className="dropdown-item"
    //                   >
    //                     Profile
    //                   </a>
    //                   <div className="dropdown-divider" />
    //                   <a href="#" className="dropdown-item text-danger">
    //                     Block
    //                   </a>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //     </ul>
    //   </div>
    // </div>
  );
}

export default ArchiveSidebar;
