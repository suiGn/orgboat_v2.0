import React, { useState, useEffect } from "react";
import empty from "../../assets/img/undraw_empty_xct9.svg";
import { Menu } from "react-feather";
import UIfx from "uifx";
import notificationAudio from "../../assets/sound/much.mp3";
import { Input } from "reactstrap";
import * as FeatherIcon from "react-feather";
import axios from "axios";
import { setOptions, Document, Page } from "react-pdf";
import PerfectScrollbar from "react-perfect-scrollbar";
const pdfjsVersion = "2.0.305";
setOptions({
  workerSrc: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`,
});

function ChatNoMessage(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputMsg,setInputMsg] = useState("");
  const [filesArray,setFilesArray] = useState([]);
  const [imgPreview,setImgPreview] = useState("");
  const [filePreview,setFilePreview] = useState("");
  const [videoPreview,setVideoPreview] = useState("");

  const { 
    socket, files, viewPreview, imageOrFile, limitChat, 
    setImageOrFile, setViewPreview, setFile
  } = props;

  useEffect(() => {
    let fileArray = []
    for (var i = 0; i < files.length; i++)
    {
      (function(file) {
        var reader = new FileReader();  
        reader.onload = ()=> {  
            fileArray.push(reader.result)
            setFilesArray(fileArray)
            switch (imageOrFile) {
              case 1:
                setImgPreview(reader.result)
                setImgPreview(fileArray[0])
                break;
              case 2:
                setFilePreview(reader.result)
                setFilePreview(fileArray[0])
                break;
              case 3:
                setVideoPreview(reader.result)
                setVideoPreview(fileArray[0])
                break;
              default:
            }
            
        }
        reader.readAsDataURL(file);
      })(files[i]);
    }
  },[files])

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
      limit: limitChat,
    });
  };

  function Send() {
    for (var i = 0; i < files.length; i++)
    {
      const formData = new FormData();
      formData.append("myFile", files[i]);
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
    }
    setImageOrFile("");
    setFilePreview("");
    setVideoPreview("");
    setImageOrFile(0);
    setViewPreview(false);
    setInputMsg("");
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
    setInputMsg("");
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

  function PreviewClick(clicked){
    switch (imageOrFile) {
      case 1:
        setImgPreview(filesArray[clicked])
        break;
      case 2:
        setFilePreview(filesArray[clicked])
        break;
      case 3:
        setVideoPreview("")
        setVideoPreview(filesArray[clicked])
        break;
      default:
    }
  }

  function Remove(clicked){
    var newFileList = Array.from(files);
    newFileList.splice(clicked,1)
    filesArray.splice(clicked,1)
    setFile(newFileList);
    setFilesArray(filesArray)
    if(filesArray.length<=0){
      setImageOrFile("");
      setFilePreview("");
      setVideoPreview("");
      setImageOrFile(0);
      setViewPreview(false);
      setInputMsg("");
    }else{
      switch (imageOrFile) {
        case 1:
          setVideoPreview(filesArray[1])
          setImgPreview(filesArray[0])
          break;
        case 2:
          setVideoPreview(filesArray[1])
          setFilePreview(filesArray[0])
          break;
        case 3:
          setVideoPreview("")
          setVideoPreview(filesArray[0])
          break;
        default:
      }
    }
  }

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
                  <div className="pdf-preview-container">
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
                    <video className="video-container-preview" controls>
                    {videoPreview != "" ?
                      <source src={videoPreview} />
                    :""}
                    </video>
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
            className="form-control input-file"
            placeholder="Write a message."
            value={inputMsg}
            onChange={handleChange}
            onKeyDown={onKeyDown}
           />
          </div>
      </div>
      <div className="chat-footer footer-file">
        <PerfectScrollbar>
          <ul className="file-list">
            {filesArray.map((img, i) => (
              <li>
                <a className="mini-preview-close" onClick={() => Remove(i)}>
                  <FeatherIcon.X />
                </a>
                {imageOrFile == 1 ? 
                  <div className="mini-preview-container" style={{backgroundImage:"url("+img+")"}}
                  onClick={() => PreviewClick(i)}>
                  </div>
                  :imageOrFile == 2?
                  <div className="mini-preview-container"
                  onClick={() => PreviewClick(i)}>
                    <Document
                      file={`${img}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>
                  :imageOrFile == 3?
                  <div className="mini-preview-container"
                  onClick={() => PreviewClick(i)}></div>
                  :"" 
                }
              </li>
              ))
            }
            <li>
            <div className="mini-preview-container-add">
            <FeatherIcon.Plus />
              <div className="mini-preview-container-add-text">Añadir archivo</div>
            </div>
            </li>
          </ul>
        </PerfectScrollbar>
        <div className="form-buttons">
          <figure class="avatar send-file mb-3">
            <span class="avatar-title send-file-button bg-info rounded-circle" onClick={Send}>
              <FeatherIcon.Send />
            </span>
          </figure>
        </div>
      </div>
    </div>
  );
}
export default ChatNoMessage;
