import React, { useEffect, useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import * as FeatherIcon from "react-feather";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { dark, light } from "@material-ui/core/styles/createPalette";
import FilePreview from "../Modals/FilePreview";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CustomInput
} from "reactstrap";
import axios from "axios";

function ChatFooter(props) {
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [imgPreview, setImgPreview] = useState(false);
  //const [file, setFile] = useState(null);
  const inputFile = useRef(null);
  const inputImage = useRef(null);
  const inputPreview = useRef(null);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handleSubmit = (e) => {
    e.preventDefault();
    if(props.inputMsg!=""){
      props.onSubmit({
        text: props.inputMsg,
        chat_uid: props.chat_uid,
        is_image: 0,
        is_file: 0,
      });
    }
  };

  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  const EmojiMenuOpen = () => {
    setEmojiMenuOpen(!emojiMenuOpen);
  };

  const AddEmoji = (e) => {
    let emoji = e.native;
    props.setInputMsg(props.inputMsg + emoji);
  };

  const onKeyDown = (e) => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  function onChangeFile(e) {
    e.preventDefault();
    //setDropdownOpen(!dropdownOpen)

    let file = e.target.files[0]
    var reader = new FileReader();

    reader.onloadend = () => {
      props.setImageOrFile(2)
      props.setFile(file)
      props.setFilePreview(reader.result)
      props.setViewPreview(true)
      //inputPreview.current.click();
    }
    
    reader.readAsDataURL(file);
    
  }

  function onChangePhoto(e) {
    e.preventDefault();
    //setDropdownOpen(!dropdownOpen)

    let file = e.target.files[0]
    var reader = new FileReader();

    reader.onloadend = () => {
      props.setImageOrFile(1)
      props.setFile(file)
      props.setImgPreview(reader.result)
      props.setViewPreview(true)
      //inputPreview.current.click();
    }
    
    reader.readAsDataURL(file);
  }

  const onButtonClickFile = () => {
    inputFile.current.click();
  };

  const onButtonClickImage = () => {
    inputImage.current.click();
  };

  return (
    <div className="chat-footer">
      {/*<FilePreview inputPreview={inputPreview} imgPreview={props.imgPreview} file={props.file}/>*/}
      <form onSubmit={handleSubmit}>
        {/* <div className="position-relative">
          <Button
            onClick={EmojiMenuOpen}
            color="light"
            className="mr-3"
            title="Emoji"
          >
            <FeatherIcon.Smile />
          </Button>
          <span
            className={"emoji-picker " + (emojiMenuOpen ? "show" : "hidden ")}
          >
            <Picker
              onSelect={AddEmoji}
              theme={props.darkSwitcherTooltipOpen ? "light" : "dark"}
              showPreview={false}
              showSkinTones={false}
              set="apple"
            />
          </span>
        </div> */}
        <Input
          type="text"
          className="form-control"
          placeholder="Write a message."
          value={props.inputMsg}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
        <div className="form-buttons">
          <Button type="submit" color="primary">
            <FeatherIcon.Send />
          </Button>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen}>
                <Button color="light">
                  <FeatherIcon.Paperclip />
                </Button>
                <input type="file" hidden ref={inputFile}  id="customFileI" name="customFileI" onChange={(e) =>onChangeFile(e)}
                accept=".pdf"/>
                <input type="file" hidden ref={inputImage}  id="customFileF" name="customFileF" onChange={(e) =>onChangePhoto(e)}
                accept=".png,.gif,.jpg"/>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => onButtonClickImage()}><FeatherIcon.Image/> Image</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => onButtonClickFile()}><FeatherIcon.File/> File</DropdownItem>
              </DropdownMenu>
          </Dropdown>
        </div>
      </form>
    </div>
  );
}

export default ChatFooter;
