import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { X, Upload, FileText } from "react-feather";
const ENDPOINT = "https://orgboat.me";

function Profile(props, clicked) {
  let userPhoto;
  let data;

  if (
    props.userProfile &&
    props.userProfile.usrprofile &&
    props.userProfile.usrprofile.length > 0
  ) {
    data = props.userProfile.usrprofile[0];

    if (data.pphoto === "") {
      userPhoto = (
        <span class="avatar-title bg-info rounded-circle">
          {data.name.substring(0, 1)}
        </span>
      );
    } else {
      userPhoto = (
        <img src={data.pphoto} class="rounded-circle" alt="image"></img>
      );
    }
  }

  return (
    <div className="sidebar-group">
      <div id="contact-information" className="sidebar">
        <header>
          <span>Profile</span>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a
                href="#"
                className="btn btn-outline-light text-danger sidebar-close"
              >
                <X />
              </a>
            </li>
          </ul>
        </header>
        <div className="sidebar-body">
          <div className="pl-4 pr-4">
            <div className="text-center">
              <figure className="avatar avatar-xl mb-4">{userPhoto}</figure>
              <h5 className="mb-1">{data && data.name}</h5>
              <small className="text-muted font-italic">Last seen: Today</small>
              <ul
                className="nav nav-tabs justify-content-center mt-5"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="profile-tab"
                    data-toggle="tab"
                    href="#profile"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Media
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="mt-4 mb-4">
                  <h6>Phone</h6>
                  <p className="text-muted">{data && data.phone}</p>
                </div>
                <div className="mt-4 mb-4">
                  <h6>City</h6>
                  <p className="text-muted">{data && data.city}</p>
                </div>
                <div className="mt-4 mb-4">
                  <h6>Website</h6>
                  <p>
                    <a href="#">{data && data.website}</a>
                  </p>
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
              </div>
              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <h6 className="mb-3 d-flex align-items-center justify-content-between">
                  <span>Recent Files</span>
                  <a href="#" className="btn btn-link small">
                    <Upload /> Upload
                  </a>
                </h6>
                <div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                      <a href="#">
                        <i className="fa fa-file-pdf-o text-danger mr-2" />{" "}
                        report4221.pdf
                      </a>
                    </li>
                    <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                      <a href="#">
                        <i className="fa fa-image text-muted mr-2" />{" "}
                        avatar_image.png
                      </a>
                    </li>
                    <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                      <a href="#">
                        <i className="fa fa-file-excel-o text-success mr-2" />
                        excel_report_file2020.xlsx
                      </a>
                    </li>
                    <li className="list-group-item pl-0 pr-0 d-flex align-items-center">
                      <a href="#">
                        <i className="fa fa-file-text-o text-warning mr-2" />{" "}
                        articles342133.txt
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
