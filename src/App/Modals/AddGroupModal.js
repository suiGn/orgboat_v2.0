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
    InputGroupAddon
} from 'reactstrap';

import ManAvatar1 from "../../assets/img/man_avatar1.jpg"
import WomenAvatar4 from "../../assets/img/women_avatar4.jpg"

// Feather icon
import * as FeatherIcon from 'react-feather';
import { func } from 'prop-types';

function AddGroupModal(props) {

    const { socket } = props;

    const my_uid = props.chatLists.my_uid;

    const [addFriends, setAddFriends] = useState([]);

    const [modal, setModal] = useState(false);

    const modalToggle = () => setModal(!modal);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const tooltipToggle = () => setTooltipOpen(!tooltipOpen);

    const [tooltipOpen2, setTooltipOpen2] = useState(false);

    const tooltipToggle2 = () => setTooltipOpen2(!tooltipOpen2);

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
    
    function GetFriends(e){
        e.preventDefault();
        setAddFriends(props.chatLists.chats)
        console.log(props.chatLists.chats)
    }

    function AddGroup(){
        setModal(!modal)
    }

    useEffect(() => {  
        //setAddFriends(props.chatLists.chats); 
    },[]);

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
                                <a  onClick={(e) => GetFriends(e)}href="#/" title="Add friends" id="Tooltip-Avatar6">
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
        </div>
    )
}

export default AddGroupModal
