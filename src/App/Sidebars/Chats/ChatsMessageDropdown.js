import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FeatherIcon from "react-feather";
import { profileAction } from "../../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../../Store/Actions/mobileProfileAction";
import { useDispatch } from "react-redux";

const ChatsMessageDropdown = () => {
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const profileActions = () => {
    dispatch(profileAction(true));
    dispatch(mobileProfileAction(true));
  };

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="dropdown-chat-message"
    >
      <DropdownToggle tag="span">
        <FeatherIcon.ChevronDown />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatsMessageDropdown;
