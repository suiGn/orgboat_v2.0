import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function AddContact(props){
  const [email,setEmail] = useState('Search by Email or Username');
  function SearchUserByEmailOrUserName() {
    console.log(email);
    const socket = socketIOClient(ENDPOINT);
    var input = email;
    setEmail('');
    socket.emit("SearchUserByEmailOrUsername", { email: input, usrname: input });
    socket.on("retrive SearchUserByEmailOrUsername", (data) => {
      console.log(data);
      // $("#searchusers-list").html("");
      // data.users.forEach((user) => {
      //   $("#searchusers-list").append(
      //     `<li>${user.name}<button type="button" onclick="AddUserContact('${user.u_id}')" data-dismiss="modal">Add</button></li>`
      //   );
      // });
    });
  }
  // useEffect(() => {
  //   console.log(email);
  // }, [email]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
    return(
        <div className="modal fade" id="addFriends" tabIndex={-1} role="dialog" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-dialog-zoom" role="document">
    <div className="modal-content" id="modal-addcontact">
      <div className="modal-header">
        <h5 className="modal-title">
          <i data-feather="user-plus" className="mr-2" /> Add Contact
        </h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <i className="ti-close" />
        </button>
      </div>
      <div className="modal-body">
        {/*<div class="alert alert-info">Send invitations to Contact.</div>*/}
        <form onSubmit={SearchUserByEmailOrUserName}>
          <div className="form-group">
    <label htmlFor="emails" className="col-form-label" onChange={handleEmail}>{email}</label>
            <input type="text" className="form-control" id="emails" />
          </div>
          <div>
        <ul className="list-group list-group-flush" id="searchusers-list" />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary">
          Submit
        </button>
      </div>
        </form>
      </div>
    </div>
  </div>
</div>
    )
}

export default AddContact;