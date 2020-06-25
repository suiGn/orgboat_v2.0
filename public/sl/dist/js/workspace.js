

$(document).ready(function () {



    var socket = io();
    var sku;
    var chats;
    var my_uid;


    socket.emit("get chats");

    socket.on('retrieve chats', function (response) {


        my_uid = response.my_uid;
        chats = response.chats;

        //Clean chat div
        $("#chats-list").html("");

        if (chats.length > 0) {

            chats.forEach(chat => {
                console.log(chat)

                //Chat_type = 0 = 1:1
                if (chat.chat_type == 0) {

                    var chat_initial;
                    var chat_name;
                    var chat_time;

                    if (chat.chat_u_id_1 != my_uid) {
                        chat_name = chat.user1_name;
                    } else {
                        chat_name = chat.user2_name;
                    }

                    chat_initial = chat_name.substring(0, 1)

                    var timeMessage = new Date(chat.last_message_time);
                    var timeLabel;
                    var today = new Date();
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (timeMessage.getDate() == today.getDate() && timeMessage.getMonth() == today.getMonth() && timeMessage.getFullYear() == today.getFullYear()) {
                        timeLabel = timeformat(timeMessage);
                    }else if(timeMessage.getDate() == yesterday.getDate() && timeMessage.getMonth() == yesterday.getMonth() && timeMessage.getFullYear() == yesterday.getFullYear()){
                        timeLabel = "Ayer";
                    }else{
                        timeLabel = getDateLabel(timeMessage)
                    }


                    $("#chats-list").append(`    
        

                        <li class="list-group-item chat-conversation-select">
                            <div>
                                <figure class="avatar">
                                    <span class="avatar-title bg-info rounded-circle">${chat_initial}</span>
                                </figure>
                            </div>
                            <div class="users-list-body">
                                <div>
                                    <h5>${chat_name}</h5>
                                    <p>${chat.last_message_message}</p>
                                </div>
                                <div class="users-list-action">
                                    <small class="text-muted">${timeLabel}</small>
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
                } else if (chat.chat_type == 1) {

                }



            });

        }

    });





});




function timeformat(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var x = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    var mytime = h + ':' + m + ' ' + x;
    return mytime;
}



function getDateLabel(date) {



    dateLabelDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    dateLabelMonth = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    dateLabelYear = date.getFullYear();

    dateLabel = dateLabelDate + '/' + dateLabelMonth + '/' + dateLabelYear;

    return dateLabel;

}