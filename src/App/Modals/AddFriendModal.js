import React, {useState} from 'react';
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
    Input
} from 'reactstrap';

// Feather icon
import * as FeatherIcon from 'react-feather';

function AddFriendModal(props) {
    const [modal, setModal] = useState(false);

    const modalToggle = () => setModal(!modal);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const tooltipToggle = () => setTooltipOpen(!tooltipOpen);

    const [email, setEmail] = useState("");
    const [findUsers, setfindUsers] = useState([]);
    function SearchUserByEmailOrUserName() {
        var input = email;
        setEmail("");
        props.socket.emit("SearchUserByEmailOrUsername", {
            email: input,
            usrname: input,
        });
        props.socket.on("retrive SearchUserByEmailOrUsername", (data) => {
            setfindUsers(data.users);
        });
    }
    function handleEmail(e) {
        setEmail(e.target.value);
    }
    function AddUserContact(u_id) {
        props.socket.emit("AddContact", { u_id: u_id });
        props.socket.on("retrive Addcontact", (mssg) => {
          props.socket.emit("init message", {
            chat: mssg.chat,
            message: mssg.message,
          });
        });
        props.socket.on("charge new contact", () => {
          props.socket.emit("get chats");
        });
    }

    return (
        <div>
            <button className="btn btn-outline-light" onClick={modalToggle} id="Tooltip-Add-Friend">
                <FeatherIcon.UserPlus/>
            </button>
            <Tooltip
                placement="bottom"
                isOpen={tooltipOpen}
                target={"Tooltip-Add-Friend"}
                toggle={tooltipToggle}>
                Add Friend
            </Tooltip>
            <Modal className="modal-dialog-zoom" isOpen={modal} toggle={modalToggle} centered>
                <ModalHeader toggle={modalToggle}>
                    <FeatherIcon.UserPlus className="mr-2"/> Add Friends
                </ModalHeader>
                <ModalBody>
                    <Alert color="info">Send invitations to friends.</Alert>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email addresses</Label>
                            <Input type="text" name="email" id="email" onChange={handleEmail}/>
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="message">Invitation message</Label>
                            <Input type="textarea" name="message" id="message"/>
                        </FormGroup> */}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => SearchUserByEmailOrUserName()}>Submit</Button>
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
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default AddFriendModal
