import React, { useState } from "react";
import { profileAction } from "../../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../../Store/Actions/mobileProfileAction";
import { useDispatch } from "react-redux";
import { userProfileAction } from "../../../Store/Actions/userProfileAction";
import { mobileUserProfileAction } from "../../../Store/Actions/mobileUserProfileAction";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as FeatherIcon from "react-feather";

const FriendsDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const profileActions = () => {
    props.setUser({ id: props.id });
    dispatch(userProfileAction(true));
    dispatch(mobileUserProfileAction(true));
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag="span">
        <FeatherIcon.MoreHorizontal />
      </DropdownToggle>
      <DropdownMenu>
        {/* <DropdownItem>New chat</DropdownItem> */}
        <DropdownItem onClick={profileActions}>Profile</DropdownItem>
        {/* <DropdownItem divider/> */}
        {/* <DropdownItem>Block</DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FriendsDropdown;
