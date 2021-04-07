import React, { useState } from "react";
import empty from "../../assets/img/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
import UIfx from "uifx";
import notificationAudio from "../../assets/sound/much.mp3";
import { Button } from "reactstrap";
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

  const { imgPreview, file, viewPreview, imageOrFile, filePreview } = props;

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
            props.onSubmit({
              text: response.data.url,
              chat_uid: props.chat_uid,
              is_image: 1,
              is_file: 0,
            });
          })
          .catch((error) => {});
        break;
      case 2:
        axios
          .post("/uploadpChatFile", formData, config)
          .then((response) => {
            props.onSubmit({
              text: response.data.url,
              chat_uid: props.chat_uid,
              is_image: 0,
              is_file: 1,
            });
          })
          .catch((error) => {});
        break;
      default:
    }
    props.setViewPreview(false);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="chat" hidden={!viewPreview}>
      <div className="chat-header">
        <div class="chat-header-user col-6">
          <span className="avatar-title preview-close rounded-circle">
            <a
              className="close-preview"
              onClick={(e) => props.setViewPreview(false)}
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
              {imageOrFile == 1 ? (
                <div className="col-12 img-preview-container-head">
                  <div className="img-preview-container">
                    <img src={imgPreview} className="img-preview" alt="image" />
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
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
