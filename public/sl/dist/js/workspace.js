



$(document).ready(function () {



    var socket = io();
    var sku;
    var chats;


    socket.emit("get chats");

    socket.on('retrieve chats', function (response) {



        chats = response.chats;
        $("#chats-list").html("");

        if (chats.length > 0) {

            chats.forEach(chat => {
                console.log(chat)


                if (chat.chat_type == 0) {

                } else if (chat.chat_type == 1) {


                    


                    $("#chats-list").append(`    
        
                        <li class="list-group-item chat-conversation-select">
                            <div>
                                <figure class="avatar">
                                    <span class="avatar-title bg-info rounded-circle">M</span>
                                </figure>
                            </div>
                            <div class="users-list-body">
                                <div>
                                    <h5>Marvin Rohan</h5>
                                    <p>Have you prepared the files?</p>
                                </div>
                                <div class="users-list-action">
                                    <small class="text-muted">Yesterday</small>
                                    <div class="action-toggle">
                                        <div class="dropdown">
                                            <a data-toggle="dropdown" href="#">
                                                <i data-feather="more-horizontal"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a href="#" class="dropdown-item">Open</a>
                                                <a href="#" data-navigation-target="contact-information"
                                                    class="dropdown-item">Profile</a>
                                                <a href="#" class="dropdown-item">Add to archive</a>
                                                <div class="dropdown-divider"></div>
                                                <a href="#" class="dropdown-item text-danger">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                    `)
                }



            });

        }

    });





});