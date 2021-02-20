import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Feather icon
import * as FeatherIcon from "react-feather";

function AddFriendModal(props) {
  const [modal, setModal] = useState(false);

  const modalToggle = () => setModal(!modal);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [showSubmit, setShowSubmit] = useState(false);

  const tooltipToggle = () => setTooltipOpen(!tooltipOpen);

  const [email, setEmail] = useState("");
  const [findUsers, setfindUsers] = useState([]);
  function SearchUserByEmailOrUserName(e) {
    e.preventDefault();
    var input = email;
    setEmail("");
    props.socket.emit("SearchUserByEmailOrUsername", {
      email: input,
      usrname: input,
    });
    props.socket.once("retrive SearchUserByEmailOrUsername", (data) => {
      setfindUsers(data.users);
    });
    setShowSubmit(false);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
    setShowSubmit(true);
  }
  function AddUserContact(u_id) {
    props.socket.emit("AddContact", { u_id: u_id });
    props.socket.once("retrive Addcontact", (mssg) => {
      props.socket.emit("init message", {
        chat: mssg.chat,
        message: mssg.message,
      });
    });
    props.socket.once("charge new contact", () => {
      props.socket.emit("get chats");
    });
    notify();
  }

  const notify = () =>
    toast.success("Usuario agregado con exito", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div>
      <button
        className="btn btn-outline-light"
        onClick={modalToggle}
        id="Tooltip-Add-Friend"
      >
        <FeatherIcon.UserPlus />
      </button>
      <Tooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={"Tooltip-Add-Friend"}
        toggle={tooltipToggle}
      >
        Add Friend
      </Tooltip>

      <Modal
        className="modal-dialog-zoom"
        isOpen={modal}
        toggle={modalToggle}
        centered
      >
        <ToastContainer />
        <ModalHeader toggle={modalToggle}>
          <FeatherIcon.UserPlus className="mr-2" /> Add Friends
        </ModalHeader>
        <ModalBody>
          <p>Send invitations to friends.</p>
          <Form>
            <FormGroup>
              <Label for="email">Email addresses</Label>
              <Input
                type="text"
                name="email"
                id="email"
                onChange={handleEmail}
              />
            </FormGroup>
            {/* <FormGroup>
                            <Label for="message">Invitation message</Label>
                            <Input type="textarea" name="message" id="message"/>
                        </FormGroup> */}
          </Form>
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
        </ModalBody>
        <ModalFooter>
          {showSubmit ? (
            <Button color="primary" onClick={SearchUserByEmailOrUserName}>
              Submit
            </Button>
          ) : (
            <Button
              color="primary"
              disabled
              onClick={SearchUserByEmailOrUserName}
            >
              Submit
            </Button>
          )}
          {/* <Button color="primary" onClick={SearchUserByEmailOrUserName}>
            Submit
          </Button> */}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AddFriendModal;
