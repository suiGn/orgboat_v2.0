

$(document).ready(function () {



    var socket = io();
    var sku;
    var chats;
    var my_uid;
    var currentPage = 0;
    var chat_selected;


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
                    } else if (timeMessage.getDate() == yesterday.getDate() && timeMessage.getMonth() == yesterday.getMonth() && timeMessage.getFullYear() == yesterday.getFullYear()) {
                        timeLabel = "Ayer";
                    } else {
                        timeLabel = getDateLabel(timeMessage)
                    }


                    $("#chats-list").append(`    
        

                        <li class="list-group-item chat-conversation-select" i='${chat.chat_uid}' n='${chat_name}'>
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



        // When the user selected a conversation
        $(".chat-conversation-select").click(function () {

            var chat_body = $('.layout .content .chat .chat-body');
            chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                cursorcolor: 'rgba(66, 66, 66, 0.20)',
                cursorwidth: "4px",
                cursorborder: '0px'
            }).resize();

            //End user SKU
            var id = $(this).attr("i");
            chat_selected = id;
            $("#chat-name").text($(this).attr("n"))



            //Get the conversation messages
            socket.emit('get messages', { id: id, page: currentPage + 1 });



        });



    });


    socket.on('chat message', function (msg) {
        
        console.log(msg)




        
        message = `${msg.from}: ${msg.message}`
        SohoExamle.Message.receive(msg.message, msg.time);
        
    });


    //Client request the messages
    socket.on('retrieve messages', function (response) {


        console.log(response.messages)
        if (response.messages.length > 0) {
            messages = response.messages.reverse();
            $('.layout .content .chat .chat-body .messages').html('');


            actualLabelDate = "";

            messages.forEach(message => {

                message_user_uid = message.message_user_uid;

                //console.log(message)

                var chat_body = $('.layout .content .chat .chat-body');

                var dateSend = new Date(message.time);
                var timeSend = timeformat(dateSend);

                var dateLabel = getDateLabel(dateSend);
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                var yesterdayLabel = getDateLabel(yesterday);
                var todayLabel = getDateLabel(new Date());



                if (dateLabel == yesterdayLabel) {
                    dateLabel = '&#160;&#160;&#160;&#160;&#160;&#160;Ayer&#160;&#160;&#160;&#160;&#160;&#160;';
                } else if (dateLabel == todayLabel) {
                    dateLabel = '&#160;&#160;&#160;&#160;&#160;&#160;Hoy&#160;&#160;&#160;&#160;&#160;&#160;';
                }

                if (actualLabelDate == dateLabel) {

                } else {

                    actualLabelDate = dateLabel;

                    $('.layout .content .chat .chat-body .messages').append(`<div class="message-item messages-divider sticky-top" data-label="${actualLabelDate}"></div>`);

                }

                console.log(dateLabel)


                var Difference_In_Time = new Date() - new Date(message.time);
                var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
                //console.log(Difference_In_Days);

                var out = (my_uid == message_user_uid) ? 'outgoing-message' : '';
                var ticks = (my_uid == message_user_uid) ? '<i class="ti-double-check text-info d-none"></i>' : '';

                $('.layout .content .chat .chat-body .messages').append(`<div class="message-item ${out}">
                        <div class="message-content">
                            ` + message.message + `
                        </div>
                        <div class="message-avatar">
                            <div>
                                <div class="time">${timeSend} ${ticks}</div>
                            </div>
                        </div>
                    </div>`);

                chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                    cursorcolor: 'rgba(66, 66, 66, 0.20)',
                    cursorwidth: "4px",
                    cursorborder: '0px'
                }).resize();


            });
        }
    });


    //Function when the user send a message
    $(document).on('submit', '.layout .content .chat .chat-footer form', function (e) {

        var input = $(this).find('input[type=text]');
        var message = input.val();

        message = $.trim(message);

        if (message) {
            socket.emit('chat message', { chat: chat_selected, message: message });
            SohoExamle.Message.send(message);
            input.val('');
        } else {
            input.focus();
        }

    });


    $(document).on('submit', '.layout .content .chat .chat-footer form', function (e) {
        e.preventDefault();
    });

    var SohoExamle = {
        Message: {
            send: function (message) {
                var chat_body = $('.layout .content .chat .chat-body');
                if (chat_body.length > 0) {

                    timeSend = timeformat(new Date())

                    $('.layout .content .chat .chat-body .messages').append(`<div class="message-item outgoing-message">
                        <div class="message-content">
                            ` + message + `
                        </div>
                        <div class="message-avatar">
                            <div>
                                <div class="time">${timeSend} <i class="ti-double-check text-info d-none"></i></div>
                            </div>
                        </div>
                    </div>`);

                    setTimeout(function () {
                        chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                            cursorcolor: 'rgba(66, 66, 66, 0.20)',
                            cursorwidth: "4px",
                            cursorborder: '0px'
                        }).resize();
                    }, 200);
                }
            },
            receive: function (message, time) {
                var chat_body = $('.layout .content .chat .chat-body');
                if (chat_body.length > 0) {

                    timeRecive = timeformat(new Date(time))

                    $('.layout .content .chat .chat-body .messages').append(`<div class="message-item">
                        <div class="message-content">
                            ` + message + `
                        </div>
                        <div class="message-avatar">
                            <div>
                                <div class="time">${timeRecive}</div>
                            </div>
                        </div>
                    </div>`);

                    setTimeout(function () {
                        chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                            cursorcolor: 'rgba(66, 66, 66, 0.20)',
                            cursorwidth: "4px",
                            cursorborder: '0px'
                        }).resize();
                    }, 200);
                }
            }
        }
    };


    $(document).on('click', '.layout .content .sidebar-group .sidebar .list-group-item', function () {

        $(this).closest('.sidebar-group').removeClass('mobile-open');

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