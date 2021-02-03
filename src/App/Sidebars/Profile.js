import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import * as FeatherIcon from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import { profileAction } from "../../Store/Actions/profileAction";
import { mobileProfileAction } from "../../Store/Actions/mobileProfileAction";
import WomenAvatar5 from "../../assets/img/women_avatar5.jpg";
import classnames from "classnames";

function Profile(props) {
  const { socket } = props;
  const dispatch = useDispatch();
  const { profileSidebar, mobileProfileSidebar } = useSelector(
    (state) => state
  );

  //const [activeTab, setActiveTab] = useState('1');
  const [state, setState] = useState({
    name: "",
    phone: "",
    city: "",
    about: "",
    pphoto: "",
    usrname: "",
    website: "",
    activeTab: "1",
  });

  /*const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };*/

  const profileActions = (e, data) => {
    e.preventDefault();
    dispatch(profileAction(false));
    dispatch(mobileProfileAction(false));
  };

  useEffect(() => {
    socket.emit("ViewOwnProfile", props.user);
    var userData;
    socket.on("retrieve viewownprofile", function (data) {
      userData = data.usrprofile[0];
      setState({
        ...state,
        name: userData ? userData.name : "",
        city: userData ? userData.city : "",
        phone: userData ? userData.phone : "",
        about: userData ? userData.about : "",
        pphoto: userData ? userData.pphoto : "",
        usrname: userData ? userData.usrname : "",
        website: userData ? userData.website : "",
      });
    });
  }, [props.user]);

  function addDefaultSrc(ev) {
    ev.target.src = WomenAvatar5;
  }

  return (
    <div
      className={`sidebar-group ${mobileProfileSidebar ? "mobile-open" : ""}`}
    >
      <div className={profileSidebar ? "sidebar active" : "sidebar"}>
        <header>
          <span>Profile</span>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a
                href="#/"
                onClick={(e) => profileActions(e)}
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
              <div className="text-center">
                <figure className="avatar avatar-xl mb-3">
                  <img
                    onError={addDefaultSrc}
                    src={state.pphoto}
                    className="rounded-circle"
                    alt="avatar"
                  />
                </figure>
                <h5 className="mb-1">{state.name}</h5>
                <small className="text-muted font-italic">
                  Last seen: Today
                </small>

                <Nav tabs className="justify-content-center mt-5">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: state.activeTab === "1",
                      })}
                    >
                      About
                    </NavLink>
                  </NavItem>
                  {/*<NavItem>
                                        <NavLink
                                            className={classnames({active: activeTab === '2'})}
                                            onClick={() => {
                                                toggle('2');
                                            }}
                                        >
                                            Media
                                        </NavLink>
                                        </NavItem>*/}
                </Nav>
              </div>
              <TabContent activeTab={state.activeTab}>
                <TabPane tabId="1">
                  <p className="text-muted">{state.about}</p>
                  <div className="mt-4 mb-4">
                    <h6>Phone</h6>
                    <p className="text-muted">{state.phone}</p>
                  </div>
                  <div className="mt-4 mb-4">
                    <h6>City</h6>
                    <p className="text-muted">{state.city}</p>
                  </div>
                  <div className="mt-4 mb-4">
                    <h6>Website</h6>
                    <p>
                      <a href="foo">{state.website}</a>
                    </p>
                  </div>
                  <div className="mt-4 mb-4">
                    <h6 className="mb-3">Social media accounts</h6>
                    <ul className="list-inline social-links">
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-facebook"
                          data-toggle="tooltip"
                          title="Facebook"
                        >
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-twitter"
                          data-toggle="tooltip"
                          title="Twitter"
                        >
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-dribbble"
                          data-toggle="tooltip"
                          title="Dribbble"
                        >
                          <i className="fa fa-dribbble"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-whatsapp"
                          data-toggle="tooltip"
                          title="Whatsapp"
                        >
                          <i className="fa fa-whatsapp"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-linkedin"
                          data-toggle="tooltip"
                          title="Linkedin"
                        >
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-google"
                          data-toggle="tooltip"
                          title="Google"
                        >
                          <i className="fa fa-google"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-behance"
                          data-toggle="tooltip"
                          title="Behance"
                        >
                          <i className="fa fa-behance"></i>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          href="foo"
                          className="btn btn-sm btn-floating btn-instagram"
                          data-toggle="tooltip"
                          title="Instagram"
                        >
                          <i className="fa fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 mb-4">
                    <h6 className="mb-3">Settings</h6>
                    <div className="form-group">
                      <div className="form-item custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch11"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch11"
                        >
                          Block
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-item custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          defaultChecked
                          id="customSwitch12"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch12"
                        >
                          Mute
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-item custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch13"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch13"
                        >
                          Get notification
                        </label>
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <h6 className="mb-3 d-flex align-items-center justify-content-between">
                    <span>Recent Files</span>
                    <a href="foo" className="btn btn-link small">
                      <i data-feather="upload" className="mr-2"></i> Upload
                    </a>
                  </h6>
                  <div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                        <a href="foo">
                          <i className="fa fa-file-pdf-o text-danger mr-2"></i>{" "}
                          report4221.pdf
                        </a>
                      </li>
                      <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                        <a href="foo">
                          <i className="fa fa-image text-muted mr-2"></i>{" "}
                          avatar_image.png
                        </a>
                      </li>
                      <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                        <a href="foo">
                          <i className="fa fa-file-excel-o text-success mr-2"></i>
                          excel_report_file2020.xlsx
                        </a>
                      </li>
                      <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                        <a href="foo">
                          <i className="fa fa-file-text-o text-warning mr-2"></i>{" "}
                          articles342133.txt
                        </a>
                      </li>
                    </ul>
                  </div>
                </TabPane>
              </TabContent>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
}

export default Profile;