import React, {useState, useEffect} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip,
    Form,
    FormGroup,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    CustomInput
} from 'reactstrap';

import ManAvatar1 from "../../assets/img/man_avatar1.jpg"
import WomenAvatar4 from "../../assets/img/women_avatar4.jpg"

// Feather icon
import * as FeatherIcon from 'react-feather';
import { func } from 'prop-types';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "reactstrap";

function AddGroupModal(props) {

    const { socket } = props;

    const [my_uid, setUid] = useState([]);

    const [addFriends, setAddFriends] = useState([]);

    const [chooseFriend, setChooseFriend] = useState([]);

    const [modal, setModal] = useState(false);

    const modalToggle = () => setModal(!modal);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const tooltipToggle = () => setTooltipOpen(!tooltipOpen);

    const [tooltipOpen2, setTooltipOpen2] = useState(false);

    const tooltipToggle2 = () => setTooltipOpen2(!tooltipOpen2);

    const [modalFriend, setModalFriend] = useState(false);

    const modalToggleFriend = () => setModalFriend(!modalFriend);

    const AvatarTooltip = (props) => {

        const [tooltipOpen, setTooltipOpen] = useState(false);

        const toggle = () => setTooltipOpen(!tooltipOpen);

        return <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={"Tooltip-Avatar" + props.id}
            toggle={toggle}>
            {props.name}
        </Tooltip>
    };

    function AddGroup(){
        setModal(!modal)
    }

    function AddNewFriends(){
        //setAddFriends(props.chatLists.chats)
        setModalFriend(!modalFriend)
    }

    function ModifyList(status,item){
        if(status){
            var newFriends = addFriends;
            newFriends.push(item)
            setAddFriends(newFriends)
        }else{
            var newFriends = addFriends;
            var removedFriend=  newFriends.filter((val) => {
                return !val.user_chat.includes(item.user_chat)
            });
            setAddFriends(removedFriend)
        }
    }

    useEffect(() => {  
        if(props.chatLists.length!=0)
        {
            setUid(props.chatLists.my_uid);
            setChooseFriend(props.chatLists.chats); 
        }
    },[props.chatLists]);

    const ModalAddFriend = (props) => {
        return(
            <div>
                <Modal className="modal-dialog-zoom" isOpen={modalFriend} toggle={modalToggleFriend} centered>
                    <ModalHeader toggle={modalToggleFriend}>
                        <FeatherIcon.UserPlus className="mr-2"/> Add Friends
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                        {
                            chooseFriend.map((item, i) => {
                                return (
                                <div>
                                    <CustomInput type="checkbox" id={"customCheckbox"+i} label={item.name} onChange={(e) => ModifyList(e.target.checked,item)}/>
                                </div>
                                )
                            })
                        }
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => AddNewFriends()}>Submit</Button>
                        <hr></hr>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    return (
        <div>
            <button className="btn btn-outline-light" onClick={modalToggle} id="Tooltip-Add-Group">
                <FeatherIcon.Users/>
            </button>
            <Tooltip
                placement="bottom"
                isOpen={tooltipOpen}
                target={"Tooltip-Add-Group"}
                toggle={tooltipToggle}>
                Add group
            </Tooltip>
            <Modal className="modal-dialog-zoom" isOpen={modal} toggle={modalToggle} centered>
                <ModalHeader toggle={modalToggle}>
                    <FeatherIcon.UserPlus className="mr-2"/> Add Group
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="group_name">Group name</Label>
                            <InputGroup>
                                <Input type="text" name="group_name" id="group_name"/>
                                <InputGroupAddon addonType="append">
                                    <Button color="light" id="Tooltip-Smile">
                                        <FeatherIcon.Smile/>
                                    </Button>
                                    <Tooltip
                                        placement="top"
                                        isOpen={tooltipOpen2}
                                        target={"Tooltip-Smile"}
                                        toggle={tooltipToggle2}>
                                        Emoji
                                    </Tooltip>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <p>The group members</p>
                            <div className="avatar-group">
                                {
                                    addFriends.map((item, i) => {
                                        return (
                                        <div>
                                            <AvatarTooltip name={item.name} id={i}/>

                                            <figure className="avatar" id={"Tooltip-Avatar"+i}>
                                                <img src={item.pphoto} className="rounded-circle" alt="avatar"/>
                                            </figure>
                                        </div>
                                        )
                                    })
                                }
                                <a  onClick={modalToggleFriend} href="#/" title="Add friends" id="Tooltip-Avatar6">
                                    <figure className="avatar">
                                        <span className="avatar-title bg-primary rounded-circle">
                                            <FeatherIcon.Plus/>
                                        </span>
                                    </figure>
                                </a>
                                <AvatarTooltip name="Add friends" id={6}/>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Invitation message</Label>
                            <Input type="textarea" name="description" id="description"/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={(e) => AddGroup(e)}>Add</Button>
                </ModalFooter>
            </Modal>
            <ModalAddFriend/>
        </div>
    )
}

export default AddGroupModal
