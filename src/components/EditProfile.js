import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { User, Target, Edit2, Phone, X } from "react-feather";
import axios from "axios";
const ENDPOINT = "https://orgboat.me";

function EditProfile(props) {
  const socket = socketIOClient(ENDPOINT);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [webSite, setWebSite] = useState("");
  const [about, setAbout] = useState("");
  const [pphoto, setPphoto] = useState("");
  const [fileState, setFileState] = useState(null);
  let profileInfo;

  useEffect(() => {
    if (
      props.userProfile &&
      props.userProfile.usrprofile &&
      props.userProfile.usrprofile.length > 0
    ) {
      profileInfo = props.userProfile.usrprofile[0];
      setName(profileInfo.name);
      setCity(profileInfo.city);
      setPhone(profileInfo.phone);
      setWebSite(profileInfo.website);
      setAbout(profileInfo.about);
      setPphoto(profileInfo.pphoto);
    } else {
      profileInfo = "";
    }
  }, [props.userProfile.usrprofile]);

  function onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", fileState);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("/uploadpPhoto", formData, config)
      .then((response) => {
        //alert("The file is successfully uploaded");
      })
      .catch((error) => {});
  }
  function onChange(e) {
    setFileState(e.target.files[0]);
  }

  function SaveProfile(e) {
    e.preventDefault();
    axios.post("/edProf", {
      fullNameEditP: name,
      cityEditP: city,
      phoneEditP: phone,
      websiteEditP: webSite,
      aboutEditP: about,
    });
  }
  return (
    <div
      className="modal fade"
      id="editProfileModal"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <Edit2 className="mr-2" />
              Edit Profile
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <X />
            </button>
          </div>
          <div className="modal-body">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#personal"
                  role="tab"
                  aria-controls="personal"
                  aria-selected="true"
                >
                  Personal
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#profilePic"
                  role="tab"
                  aria-controls="profilePic"
                  aria-selected="true"
                >
                  Update Profile Picture
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#about"
                  role="tab"
                  aria-controls="about"
                  aria-selected="false"
                >
                  About
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className="tab-pane show active"
                id="personal"
                role="tabpanel"
              >
                <form
                  method="post"
                  // action="/edProf"
                  // onSubmit={(e) => e.preventDefault()}
                  onSubmit={(e) => SaveProfile(e)}
                >
                  <div className="form-group">
                    <label htmlFor="fullname" className="col-form-label">
                      Full Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="fullNameEditP"
                        id="fullname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <User />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="city" className="col-form-label">
                      City
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="cityEditP"
                        className="form-control"
                        id="city"
                        placeholder="Ex: Columbia"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <Target />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="col-form-label">
                      Phone
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="phoneEditP"
                        id="phone"
                        placeholder="(555) 555 55 55"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <Phone />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="website" className="col-form-label">
                      Website
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="websiteEditP"
                      id="website"
                      placeholder="https://"
                      value={webSite}
                      onChange={(e) => setWebSite(e.target.value)}
                    />
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      defaultChecked
                      id="customCheck1"
                    />
                    <label
                      className="custom-control-label"
                      name="isPublicEditP"
                      htmlFor="customCheck1"
                    >
                      Public Profile
                    </label>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div class="tab-pane" id="profilePic" role="tabpanel">
                <div className="form-group">
                  <form id="uploadForm" method="post" onSubmit={onFormSubmit}>
                    <label className="col-form-label">Avatar</label>
                    <div className="d-flex align-items-center">
                      <div>
                        <figure
                          className="avatar mr-3 item-rtl"
                          id="changeprofilepicPphoto"
                          data={pphoto}
                        ></figure>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          name="myImage"
                          className="custom-file-input"
                          id="customFile"
                          style={{ fontColor: "white !important" }}
                          //data={pphoto}
                          onChange={onChange}
                        />
                        <label
                          className="custom-file-label"
                          id="cPPIT"
                          htmlFor="customFile"
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pphoto ? pphoto : "Choose file"}
                        </label>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginRight: "-28px !important" }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="tab-pane" id="about" role="tabpanel">
                <div className="form-group">
                  <label htmlFor="about-text" className="col-form-label">
                    Write a few words that describe you
                  </label>
                  <textarea
                    name="aboutEditP"
                    className="form-control"
                    id="about-text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
