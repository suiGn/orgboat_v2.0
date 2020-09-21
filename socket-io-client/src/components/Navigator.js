import React from 'react';


export default class Navigator extends React.Component{
    render(){
        return(
            <nav className="navigation">
            <div className="nav-group">
                <ul>
                    <li className="logo">
                        <a href="#">
                        </a>
                    </li>
                    <li>
                        <a className="active" data-navigation-target="chats" href="#" data-toggle="tooltip" title="Chats"
                           data-placement="right">
                            <span className="badge badge-warning"></span>
                            <i data-feather="message-circle"></i>
                        </a>
                    </li>
                    <li>
                        <a data-navigation-target="friends" href="#" data-toggle="tooltip"
                           title="Friends" data-placement="right">
                            <span className="badge badge-danger"></span>
                            <i data-feather="user"></i>
                        </a>
                    </li>
                    <li>
                        <a data-navigation-target="favorites" data-toggle="tooltip" title="Favorites" data-placement="right"
                           href="#">
                            <i data-feather="star"></i>
                        </a>
                    </li>
                    <li className="brackets">
                        <a data-navigation-target="archived" href="#" data-toggle="tooltip"
                           title="Archived" data-placement="right">
                            <i data-feather="archive"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="dark-light-switcher" data-toggle="tooltip" title="Dark mode"
                           data-placement="right">
                            <i data-feather="moon"></i>
                        </a>
                    </li>
                    <li data-toggle="tooltip" title="User menu" data-placement="right">
                        <a href="./login.html" data-toggle="dropdown">
                            <figure className="avatar">
                                <img src="http://via.placeholder.com/128X128" className="rounded-circle" alt="image"/>
                            </figure>
                        </a>
                        <div className="dropdown-menu">
                            <a href="#" className="dropdown-item" data-toggle="modal" data-target="#editProfileModal">Edit
                                profile</a>
                            <a href="#" className="dropdown-item" data-navigation-target="contact-information">Profile</a>
                            <a href="#" className="dropdown-item" data-toggle="modal" data-target="#settingModal">Settings</a>
                            <div className="dropdown-divider"></div>
                            <a href="login.html" className="dropdown-item text-danger">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>  
        )
    }

}