import React, { useState, useEffect }  from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "localhost:5000";
// function Chat(){
//     const [response, setResponse] = useState("");
//     useEffect(() => {
//         const socket = socketIOClient(ENDPOINT);
//         socket.on("retrieve chats", data => {
//           setResponse(data);
//         });
//       }, []);
//       return (
//         <p>
//           It's {response}
//         </p>
//       );
// }

// export default Chat;
export default class Chat extends React.Component {
    
  render() {
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
            <li className="list-group-item">
              <figure className="avatar avatar-state-success">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
              <div className="users-list-body">
                <div>
                  <h5 className="text-primary">Townsend Seary</h5>
                  <p>What's up, how are you?</p>
                </div>
                <div className="users-list-action">
                  <div className="new-message-count">3</div>
                  <small className="text-primary">03:41 PM</small>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <figure className="avatar avatar-state-warning">
                <img
                  src="http://via.placeholder.com/128X128"
                  className="rounded-circle"
                  alt="image"
                />
              </figure>
              <div className="users-list-body">
                <div>
                  <h5 className="text-primary">Forest Kroch</h5>
                  <p>
                    <i className="fa fa-camera mr-1" /> Photo
                  </p>
                </div>
                <div className="users-list-action">
                  <div className="new-message-count">1</div>
                  <small className="text-primary">Yesterday</small>
                </div>
              </div>
            </li>
            <li className="list-group-item open-chat">
              <div>
                <figure className="avatar">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Byrom Guittet</h5>
                  <p>I sent you all the files. Good luck with 😃</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">11:05 AM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Margaretta Worvell</h5>
                  <p>I need you today. Can you come with me?</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <figure className="avatar">
                <span className="avatar-title bg-warning bg-success rounded-circle">
                  <i className="fa fa-users" />
                </span>
              </figure>
              <div className="users-list-body">
                <div>
                  <h5>😍 My Family 😍</h5>
                  <p>
                    <strong>Maher Ruslandi: </strong>Hello!!!
                  </p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">Yesterday</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar avatar-state-warning">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Jennica Kindred</h5>
                  <p>
                    <i className="fa fa-video-camera mr-1" />
                    Video
                  </p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <span className="avatar-title bg-info rounded-circle">M</span>
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Marvin Rohan</h5>
                  <p>Have you prepared the files?</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">Yesterday</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Townsend Seary</h5>
                  <p>Where are you?</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <span className="avatar-title bg-secondary rounded-circle">
                    G
                  </span>
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Gibb Ivanchin</h5>
                  <p>I want to visit them.</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Harald Kowalski</h5>
                  <p>Reports are ready.</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <span className="avatar-title bg-success rounded-circle">
                    A
                  </span>
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Afton McGilvra</h5>
                  <p>I do not know where is it. Don't ask me, please.</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>
                <figure className="avatar">
                  <img
                    src="http://via.placeholder.com/128X128"
                    className="rounded-circle"
                    alt="image"
                  />
                </figure>
              </div>
              <div className="users-list-body">
                <div>
                  <h5>Alexandr Donnelly</h5>
                  <p>Can anyone enter the meeting?</p>
                </div>
                <div className="users-list-action">
                  <small className="text-muted">03:41 PM</small>
                  <div className="action-toggle">
                    <div className="dropdown">
                      <a data-toggle="dropdown" href="#">
                        <i data-feather="more-horizontal" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="#" className="dropdown-item">
                          Open
                        </a>
                        <a
                          href="#"
                          data-navigation-target="contact-information"
                          className="dropdown-item"
                        >
                          Profile
                        </a>
                        <a href="#" className="dropdown-item">
                          Add to archive
                        </a>
                        <div className="dropdown-divider" />
                        <a href="#" className="dropdown-item text-danger">
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  
}
