import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";
function Chat() {
  const [response, setResponse] = useState([]);
  let chats;
  let my_uid;
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("get chats");
    socket.on("retrieve chats", (response) => {
      setResponse(response);
      // console.log(response);
    });
  }, [response]);
  chats = response.chats;
  my_uid = response.my_uid;
  console.log("Respuesta", response);
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

  return (
    <div id="chats" className="sidebar active">
      <header>
        <span>Chats</span>
        <ul className="list-inline">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            title="New group"
          >
            <a
              className="btn btn-outline-light"
              href="#"
              data-toggle="modal"
              data-target="#newGroup"
            >
              <i data-feather="users" />
            </a>
          </li>
          <li className="list-inline-item">
            <a
              className="btn btn-outline-light"
              data-toggle="tooltip"
              title="New chat"
              href="#"
              data-navigation-target="friends"
            >
              <i data-feather="plus-circle" />
            </a>
          </li>
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
          placeholder="Search chats"
        />
      </form>
      <div className="sidebar-body">
        <ul className="list-group list-group-flush">
          {chats &&
            chats.map((chat) => {
              if (
                chat.chat_type == 0 &&
                chat.archiveChat == 0 &&
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
                  //var pphotoUser = new File([""], chat.pphoto);
                  //var p = "";
                  console.log(chat.pphoto);
                  if (chat.pphoto === "") {
                    p = (
                      <span class="avatar-title bg-info rounded-circle">
                        {chat_initial}
                      </span>
                    );
                  } else {
                    p = (
                      <img
                        src={"/pphotoChat/" + chat_name}
                        class="rounded-circle"
                        alt="image"
                      />
                    );
                  }
                  return (
                    <li
                      className="list-group-item chat-conversation-select"
                      key={chat.chat_uid}
                      i={chat.chat_uid}
                      n={chat_name}
                      t={timeMessage.getTime()}
                      u={chat_with_usr}
                    >
                      <div>
                        <figure className="avatar">{p}</figure>
                      </div>
                      <div class="users-list-body">
                        <div>
                          <h5 class="last-message-user" i={chat.chat_uid}>
                            {chat_name}
                          </h5>
                          <p class="last-message-chat" i={chat.chat_uid}>
                            {chat.last_message_message}
                          </p>
                        </div>
                        <div class="users-list-action">
                          <div
                            class="new-message-count d-none"
                            i={chat.chat_uid}
                          ></div>
                          <small
                            class="text-muted last-message-time"
                            i={chat.chat_uid}
                          >
                            {timeLabel} 111
                          </small>
                          <div class="action-toggle">
                            <div class="dropdown">
                              <a data-toggle="dropdown" href="#">
                                <i class="fa fa-ellipsis-h"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-right">
                                <a href="#" class="dropdown-item">
                                  Open
                                </a>
                                <button
                                //   onClick="profiledata('${
                                //   chat.chat_uid
                                // }')"
                                  data-navigation-target="contact-information"
                                  class="dropdown-item"
                                >
                                  Profile
                                </button>
                                <a
                                  href="#"
                                //   onClick="ArchiveChat('${
                                //   chat.chat_uid
                                // }')"
                                  class="dropdown-item"
                                >
                                  Add to archive
                                </a>
                                <div class="dropdown-divider"></div>
                                <a
                                  href="#"
                                  class="dropdown-item text-danger"
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
                } else if (chat.chat_type == 1) {
                  if (chat.user_chat == chat.last_message_user_uid) {
                    let chat_name = chat.chat_name;
                    let chat_with_usr = chat.user_chat;
                    let chat_initial = chat_name.substring(0, 1);
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
                      timeLabel = "Ayer";
                    } else {
                      timeLabel = getDateLabel(timeMessage);
                    }
                    return (
                      <li
                        className="list-group-item chat-conversation-select"
                        key={chat.chat_uid}
                        i={chat.chat_uid}
                        n={chat_name}
                        t={timeMessage.getTime()}
                        u={chat_with_usr}
                      >
                        <div>
                          <figure className="avatar">
                            <span className="avatar-title bg-info rounded-circle">
                              {chat_initial}
                            </span>
                          </figure>
                          <div className="users-list-body">
                            <div>
                              <h5
                                className="last-message-user"
                                i={chat.chat_uid}
                              >
                                {chat_name}
                              </h5>
                              <p
                                className="last-message-chat"
                                i={chat.chat_uid}
                              >
                                {chat.name}: {chat.last_message_message}
                              </p>
                            </div>
                          </div>
                          <div className="users-list-action">
                            <div
                              className="new-message-count d-none"
                              i={chat.chat_uid}
                            >
                              <small
                                className="text-muted last-message-time"
                                i={chat.chat_uid}
                              >
                                {timeLabel}
                              </small>
                              <div className="action-toggle">
                                <div className="dropdown">
                                  <a data-toggle="dropdown" href="#">
                                    <i className="fa fa-ellipsis-h"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item">
                                      Open
                                    </a>
                                    <button
                                      // onClick={profiledata({chat.chat_uid})}
                                      data-navigation-target="contact-information"
                                      className="dropdown-item"
                                    >
                                      Profile
                                    </button>
                                    <a
                                      href="#"
                                      // onClick="ArchiveChat('${chat.chat_uid}')"
                                      className="dropdown-item"
                                    >
                                      Add to archive
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <a
                                      href="#"
                                      className="dropdown-item text-danger"
                                    >
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                }
              }
            })}
        </ul>
      </div>
    </div>
  );
}

export default Chat;
// export default class Chat extends React.Component {

//   render() {
//     return (
//       <div id="chats" className="sidebar active">
//         <header>
//           <span>Chats</span>
//           <ul className="list-inline">
//             <li
//               className="list-inline-item"
//               data-toggle="tooltip"
//               title="New group"
//             >
//               <a
//                 className="btn btn-outline-light"
//                 href="#"
//                 data-toggle="modal"
//                 data-target="#newGroup"
//               >
//                 <i data-feather="users" />
//               </a>
//             </li>
//             <li className="list-inline-item">
//               <a
//                 className="btn btn-outline-light"
//                 data-toggle="tooltip"
//                 title="New chat"
//                 href="#"
//                 data-navigation-target="friends"
//               >
//                 <i data-feather="plus-circle" />
//               </a>
//             </li>
//             <li className="list-inline-item d-xl-none d-inline">
//               <a
//                 href="#"
//                 className="btn btn-outline-light text-danger sidebar-close"
//               >
//                 <i data-feather="x" />
//               </a>
//             </li>
//           </ul>
//         </header>
//         <form>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search chats"
//           />
//         </form>
//         <div className="sidebar-body">
//           <ul className="list-group list-group-flush">
//             <li className="list-group-item">
//               <figure className="avatar avatar-state-success">
//                 <img
//                   src="http://via.placeholder.com/128X128"
//                   className="rounded-circle"
//                   alt="image"
//                 />
//               </figure>
//               <div className="users-list-body">
//                 <div>
//                   <h5 className="text-primary">Townsend Seary</h5>
//                   <p>What's up, how are you?</p>
//                 </div>
//                 <div className="users-list-action">
//                   <div className="new-message-count">3</div>
//                   <small className="text-primary">03:41 PM</small>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <figure className="avatar avatar-state-warning">
//                 <img
//                   src="http://via.placeholder.com/128X128"
//                   className="rounded-circle"
//                   alt="image"
//                 />
//               </figure>
//               <div className="users-list-body">
//                 <div>
//                   <h5 className="text-primary">Forest Kroch</h5>
//                   <p>
//                     <i className="fa fa-camera mr-1" /> Photo
//                   </p>
//                 </div>
//                 <div className="users-list-action">
//                   <div className="new-message-count">1</div>
//                   <small className="text-primary">Yesterday</small>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item open-chat">
//               <div>
//                 <figure className="avatar">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Byrom Guittet</h5>
//                   <p>I sent you all the files. Good luck with 😃</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">11:05 AM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Margaretta Worvell</h5>
//                   <p>I need you today. Can you come with me?</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <figure className="avatar">
//                 <span className="avatar-title bg-warning bg-success rounded-circle">
//                   <i className="fa fa-users" />
//                 </span>
//               </figure>
//               <div className="users-list-body">
//                 <div>
//                   <h5>😍 My Family 😍</h5>
//                   <p>
//                     <strong>Maher Ruslandi: </strong>Hello!!!
//                   </p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">Yesterday</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar avatar-state-warning">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Jennica Kindred</h5>
//                   <p>
//                     <i className="fa fa-video-camera mr-1" />
//                     Video
//                   </p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <span className="avatar-title bg-info rounded-circle">M</span>
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Marvin Rohan</h5>
//                   <p>Have you prepared the files?</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">Yesterday</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Townsend Seary</h5>
//                   <p>Where are you?</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <span className="avatar-title bg-secondary rounded-circle">
//                     G
//                   </span>
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Gibb Ivanchin</h5>
//                   <p>I want to visit them.</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Harald Kowalski</h5>
//                   <p>Reports are ready.</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <span className="avatar-title bg-success rounded-circle">
//                     A
//                   </span>
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Afton McGilvra</h5>
//                   <p>I do not know where is it. Don't ask me, please.</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             <li className="list-group-item">
//               <div>
//                 <figure className="avatar">
//                   <img
//                     src="http://via.placeholder.com/128X128"
//                     className="rounded-circle"
//                     alt="image"
//                   />
//                 </figure>
//               </div>
//               <div className="users-list-body">
//                 <div>
//                   <h5>Alexandr Donnelly</h5>
//                   <p>Can anyone enter the meeting?</p>
//                 </div>
//                 <div className="users-list-action">
//                   <small className="text-muted">03:41 PM</small>
//                   <div className="action-toggle">
//                     <div className="dropdown">
//                       <a data-toggle="dropdown" href="#">
//                         <i data-feather="more-horizontal" />
//                       </a>
//                       <div className="dropdown-menu dropdown-menu-right">
//                         <a href="#" className="dropdown-item">
//                           Open
//                         </a>
//                         <a
//                           href="#"
//                           data-navigation-target="contact-information"
//                           className="dropdown-item"
//                         >
//                           Profile
//                         </a>
//                         <a href="#" className="dropdown-item">
//                           Add to archive
//                         </a>
//                         <div className="dropdown-divider" />
//                         <a href="#" className="dropdown-item text-danger">
//                           Delete
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

// }
