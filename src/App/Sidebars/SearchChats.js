import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import * as FeatherIcon from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import Moment from "react-moment";
import "moment-timezone";

function SearchChat(props) {
  const { socket } = props;
  const {
    scrollEl,
    setScrollEl,
    setOpenSearchSidebar,
    openSearchSidebar,
  } = props;
  const dispatch = useDispatch();
  const [searchInChat, setSearchInChat] = useState("");
  const [messages, setChatMessages] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const { searchChat } = useSelector((state) => state);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const calendarStrings = {
    lastDay: "[Yesterday]",
    sameDay: "LT",
    nextDay: "[Tomorrow at] LT",
    lastWeek: "dddd",
    nextWeek: "dddd [at] LT",
    sameElse: "L",
  };

  const searchChatToggler = (e) => {
    e.preventDefault();
    setOpenSearchSidebar(!openSearchSidebar);
    setChatMessages([]);
  };

  function RetrieveMessages(data) {
    if (data.messages.length != 0) {
      if (props.clicked.chat_uid == data.messages[0].chat_uid) {
        let messages = [];
        data.messages.forEach((element) => {
          if (element.delete_message_to == 1) {
            if (element.message_user_uid == props.my_uid.id) {
              messages.push(element);
            }
          } else {
            messages.push(element);
          }
        });
        setChatMessages(messages.reverse());
      }
      setSearchInChats(messages);
    }
  }

  function setSearchInChats(messages) {
    if (searchInChat.length >= 1 && messages.length > 0) {
      let searchStringSplit = searchInChat.split(/(\s+)/).filter(function (e) {
        return e.trim().length > 1;
      });
      if (searchStringSplit.length >= 1) {
        let apps = messages.filter((word) => {
          let containsAtLeastOneWord = false;
          searchStringSplit.forEach((searchWord) => {
            if (word.message.toLowerCase().includes(searchWord))
              containsAtLeastOneWord = true;
          });
          if (containsAtLeastOneWord) return word;
        });
        setFilteredChats(apps);
      }
    } else {
      setFilteredChats([]);
    }
  }

  function SearchInsideBody(id) {
    let size = document.getElementById(id).getBoundingClientRect();
    scrollEl.scrollTop = size.top;
    document.getElementById(id).classList.add("found");
    if (document.getElementById(id)) {
      setTimeout(function () {
        document.getElementById(id).classList.remove("found");
      }, 1000);
    }
  }

  useEffect(() => {
    setSearchInChat([]);
    setFilteredChats([]);
    setChatMessages([]);
  }, [openSearchSidebar == false]);

  useEffect(() => {
    setFilteredChats([]);
    setChatMessages([]);
    socket.on("retrieve messages", RetrieveMessages);
    socket.emit("get messages", {
      id: props.clicked.chat_uid,
      page: 1,
      inChat: true,
      limit: 30,
    });
    return () => {
      socket.off("retrieve messages", RetrieveMessages);
    };
  }, [searchInChat]);

  const PreventSubmit = (e) => {
    e.preventDefault();
    setSearchInChat([]);
    setFilteredChats([]);
    setChatMessages([]);
  };

  // function handlePagination(container) {
  //   let sh = container.scrollHeight;
  //   let st = container.scrollTop;
  //   let ht = container.offsetHeight;
  //   if (ht == 0 || st == sh - ht) {
  //     setPage(page + 1);
  //     setLimit(limit + 10);
  //     socket.emit("get messages", {
  //       id: props.clicked.chat_uid,
  //       page: page,
  //       inChat: true,
  //       limit: limit,
  //     });
  //   }
  // }

  return (
    <div className={`sidebar-group ${openSearchSidebar ? "mobile-open" : ""}`}>
      <div className={openSearchSidebar ? "sidebar active" : "sidebar"}>
        <header>
          <span>Search</span>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a
                href="#/"
                onClick={(e) => searchChatToggler(e)}
                className="btn btn-outline-light text-danger sidebar-close"
              >
                <FeatherIcon.X />
              </a>
            </li>
          </ul>
        </header>
        <div className="sidebar-body">
          <PerfectScrollbar>
            <div className="pl-4 pr-4">
              <div className="pt-4 pb-4">
                <InputGroup>
                  <InputGroupAddon>
                    <Button onClick={(e) => PreventSubmit(e)} color="light">
                      <FeatherIcon.Search />
                    </Button>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    value={searchInChat}
                    onChange={(e) => setSearchInChat(e.target.value)}
                    placeholder="Search..."
                  />
                </InputGroup>
              </div>
              {searchInChat.length > 1 ? (
                <ul className="list-group list-group-flush">
                  {filteredChats.length > 0 &&
                    filteredChats.map((chat, i) => (
                      <li
                        onClick={() => SearchInsideBody(chat.message_id)}
                        className="list-group-item row"
                      >
                        <small className="text-muted col-12">
                          <Moment calendar={calendarStrings}>
                            {chat.time}
                          </Moment>
                        </small>
                        <div className=" col-12">{chat.message}</div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="p-5 text-center">
                  Buscar mensajes con {props.clicked.name}
                </div>
              )}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
}

export default SearchChat;
