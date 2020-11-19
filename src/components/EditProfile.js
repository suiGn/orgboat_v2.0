import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function EditProfile(props) {
  const socket = socketIOClient(ENDPOINT);
  console.log(props);
  let profileInfo;

  if (
    props.userProfile &&
    props.userProfile.usrprofile &&
    props.userProfile.usrprofile.length > 0
  ) {
    profileInfo = props.userProfile.usrprofile[0];
  } else {
    profileInfo = "";
  }

  console.log(profileInfo);

  return (
    <div
      class="modal fade"
      id="editProfileModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-zoom"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i data-feather="edit-2" class="mr-2"></i> Edit Profile
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <i class="ti-close"></i>
            </button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link active"
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
              <li class="nav-item">
                <a
                  class="nav-link"
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
            <div class="tab-content">
              <div class="tab-pane show active" id="personal" role="tabpanel">
                <form method="post" action="/edProf" method="post" />
                <div class="form-group">
                  <label for="fullname" class="col-form-label">
                    Full Name
                  </label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      name="fullNameEditP"
                      id="fullname"
                      value={profileInfo.name}
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="user"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="city" class="col-form-label">
                    City
                  </label>
                  <div class="input-group">
                    <input
                      type="text"
                      name="cityEditP"
                      class="form-control"
                      id="city"
                      placeholder="Ex: Columbia"
                      value={profileInfo.city}
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="target"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="phone" class="col-form-label">
                    Phone
                  </label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      name="phoneEditP"
                      id="phone"
                      placeholder="(555) 555 55 55"
                      value={profileInfo.phone}
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <i data-feather="phone"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="website" class="col-form-label">
                    Website
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    name="websiteEditP"
                    id="website"
                    placeholder="https://"
                    value={profileInfo.website}
                  />
                </div>
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    checked
                    id="customCheck1"
                  />
                  <label
                    class="custom-control-label"
                    name="isPublicEditP"
                    for="customCheck1"
                  >
                    Public Profile
                  </label>
                </div>
              </div>
              <div className="tab-pane" id="profilePic" role="tabpanel">
                <form
                  id="uploadForm"
                  encType="multipart/form-data"
                  method="post"
                  action="/uploadpPhoto"
                >
                  <label className="col-form-label">Choose Photo:</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure
                        className="avatar mr-3 item-rtl"
                        id="changeprofilepicPphoto"
                        data={profileInfo.pphoto}
                      ></figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="avatarEditP"
                        className="custom-file-input"
                        id="customFile"
                        style={{ fontColor: "white !important" }}
                        onchange="inputPath(this.value)"
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
                        Choose file
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div class="tab-pane" id="about" role="tabpanel">
                <div class="form-group">
                  <label for="about-text" class="col-form-label">
                    {profileInfo.about}
                  </label>
                  <textarea
                    name="aboutEditP"
                    class="form-control"
                    id="about-text"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">
                Save
              </button>
              <form />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
