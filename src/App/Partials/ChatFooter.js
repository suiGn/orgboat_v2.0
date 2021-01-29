import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import * as FeatherIcon from "react-feather";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { dark, light } from "@material-ui/core/styles/createPalette";

function ChatFooter(props) {
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit({
      text: props.inputMsg,
      chat_uid: props.chat_uid,
    });
  };

  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  const EmojiMenuOpen = () => {
    setEmojiMenuOpen(!emojiMenuOpen);
  };

  const AddEmoji = (e) => {
    let emoji = e.native;
    console.log(emoji);
    props.setInputMsg(props.inputMsg + emoji);
  };

  return (
    <div className="chat-footer">
      <form onSubmit={handleSubmit}>
        <div className="position-relative">
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
        </div>
        <Input
          type="text"
          className="form-control"
          placeholder="Write a message."
          value={props.inputMsg}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <Button color="light">
            <FeatherIcon.Paperclip />
          </Button>
          <Button color="light" className="d-sm-none d-block">
            <FeatherIcon.Mic />
          </Button>
          <Button color="primary">
            <FeatherIcon.Send />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatFooter;
