import React, { useState } from "react";
import empty from "../../assets/img/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
import UIfx from "uifx";
import notificationAudio from "../../assets/sound/much.mp3";
import { Input } from "reactstrap";
import * as FeatherIcon from "react-feather";
import axios from "axios";
import { setOptions, Document, Page } from "react-pdf";
const pdfjsVersion = "2.0.305";
setOptions({
  workerSrc: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`,
});

function ChatNoMessage(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputMsg,setInputMsg] = useState("");

  const { 
    socket, imgPreview, file, viewPreview, imageOrFile, filePreview,
    videoPreview, setImageOrFile, setFilePreview, setVideoPreview, setViewPreview
  } = props;

  const handleSubmit = (newValue) => {
    socket.emit("chat message", {
      chat: newValue.chat_uid,
      message: newValue.text,
      is_image: newValue.is_image,
      is_file: newValue.is_file,
      is_video: newValue.is_video,
      file: newValue.file
    });
    socket.emit("get chats");
    socket.emit("get messages", {
      id: newValue.chat_uid,
      page: 1,
      limit: 10,
    });
  };

  function Send() {
    const formData = new FormData();
    formData.append("myFile", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    switch (imageOrFile) {
      case 1:
        axios
          .post("/uploadpChatFile", formData, config)
          .then((response) => {
            handleSubmit({
              text: inputMsg,
              chat_uid: props.chat_uid,
              is_image: 1,
              is_file: 0,
              is_video: 0,
              file: response.data.url
            });
          })
          .catch((error) => {});
        break;
      case 2:
        axios
          .post("/uploadpChatFile", formData, config)
          .then((response) => {
            handleSubmit({
              text: inputMsg,
              chat_uid: props.chat_uid,
              is_image: 0,
              is_file: 1,
              is_video: 0,
              file: response.data.url
            });
          })
          .catch((error) => {});
        break;
      case 3:
        axios
          .post("/uploadpChatFile", formData, config)
          .then((response) => {
            handleSubmit({
              text: inputMsg,
              chat_uid: props.chat_uid,
              is_image: 0,
              is_file: 0,
              is_video: 1,
              file: response.data.url
            });
          })
          .catch((error) => {});
        break;
      default:
    }
    setImageOrFile("");
    setFilePreview("");
    setVideoPreview("");
    setImageOrFile(0);
    setViewPreview(false);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function ClosePreview(e){
    e.preventDefault();
    setImageOrFile("");
    setFilePreview("");
    setVideoPreview("");
    setImageOrFile(0);
    setViewPreview(false);
  }

  const handleChange = (e) => {
    setInputMsg(e.target.value);
  };

  const onKeyDown = (e) => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      Send();
    }
  };

  return (
    <div className="chat" hidden={!viewPreview}>
      <div className="chat-header">
        <div class="chat-header-user col-6">
          <span className="avatar-title preview-close rounded-circle">
            <a
              className="close-preview"
              onClick={(e) => ClosePreview(e)}
            >
              <FeatherIcon.X />
            </a>
          </span>
          <h3>Preview</h3>
        </div>
      </div>
      <div className="chat-body">
        <div
          id="nochatselected"
          className="justify-content-center align-items-center d-flex h-100"
        >
          <div className="no-message-container custom-chat-message">
            <div className="row mb-5 chat-body-custom">
              {imageOrFile == 1 ? 
                <div className="col-12 img-preview-container-head">
                  <div className="img-preview-container">
                    <img src={imgPreview} className="img-preview" alt="image" />
                  </div>
                </div>
               : 
               imageOrFile == 2 ? 
                <div className="col-12 img-preview-container-head">
                  <div className="img-preview-container">
                    <Document
                      file={`${filePreview}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>
                </div> 
                :
                imageOrFile == 3 ? 
                <div className="col-12 img-preview-container-head">
                  <div className="img-preview-container">
                    {videoPreview != "" ? 
                    <video className="video-container-preview" controls>
                      <source src={videoPreview} />
                    </video>:""}
                  </div>
                </div>
                :
                ""
              }
            </div>
          </div>
        </div>
        <div>
            <Input
            type="text"
            className="form-control"
            placeholder="Write a message."
            value={inputMsg}
            onChange={handleChange}
            onKeyDown={onKeyDown}
           />
          </div>
      </div>
      <div className="chat-footer footer-file">
        <div className="form-buttons">
          <figure class="avatar send-file mb-3" onClick={Send}>
            <span class="avatar-title send-file-button bg-info rounded-circle">
              <FeatherIcon.Send />
            </span>
          </figure>
        </div>
      </div>
    </div>
  );
}
export default ChatNoMessage;
