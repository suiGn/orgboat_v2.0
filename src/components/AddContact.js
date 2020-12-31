import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function AddContact(props) {
  const [email, setEmail] = useState("");
  const [findUsers, setfindUsers] = useState([]);
  function SearchUserByEmailOrUserName() {
    const socket = socketIOClient(ENDPOINT);
    var input = email;
    setEmail("");
    socket.emit("SearchUserByEmailOrUsername", {
      email: input,
      usrname: input,
    });
    socket.on("retrive SearchUserByEmailOrUsername", (data) => {
      setfindUsers(data.users);
    });
  }

  function AddUserContact(u_id) {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("AddContact", { u_id: u_id });
    socket.on("retrive Addcontact", (mssg) => {
      socket.emit("init message", {
        chat: mssg.chat,
        message: mssg.message,
      });
    });
    socket.on("charge new contact", () => {
      socket.emit("get chats");
    });
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  return (
    <div
      className="modal fade"
      id="addFriends"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
        role="document"
      >
        <div className="modal-content" id="modal-addcontact">
          <div className="modal-header">
            <h5 className="modal-title">
              <i data-feather="user-plus" className="mr-2" /> Add Contact
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti-close" />
            </button>
          </div>
          <div className="modal-body">
            {/*<div class="alert alert-info">Send invitations to Contact.</div>*/}
            <form>
              <div className="form-group">
                <label htmlFor="emails" className="col-form-label">
                  Search by Email or Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="emails"
                  onChange={handleEmail}
                />
              </div>
              <div>
                <ul
                  className="list-group list-group-flush"
                  id="searchusers-list"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => SearchUserByEmailOrUserName()}
                >
                  Submit
                </button>
              </div>
              <hr></hr>
              <div>
                {findUsers && findUsers.length > 0 ? (
                  findUsers.map((userf, index) => {
                    return (
                      <li className="custom-modal-text">
                        {userf.name}
                        <button
                          type="button"
                          onClick={() => AddUserContact(userf.u_id)}
                          data-dismiss="modal"
                          className="btn btn-primary ml-5 mt-2"
                        >
                          Add
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <span></span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContact;
