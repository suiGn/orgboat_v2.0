const { io, orgboatDB, sessionStore, server } = require("../index");
const { json } = require("sequelize");
const uuid = require("node-uuid");
const { formatLocalDate } = require("../middlewares/authentication");
const routes = require("../routes");
const { use } = require("passport");
const {logger} = require('../logs/log');

io.on("connection", function (socket) {
  //login in socket
  try {
    var user = socket.request.session.passport.user;
    //console.log(user);
    if (user != null || user != undefined) {
      socket.join(user.u_id);
      console.log(
        `[Socket.io] - Connected user: ${user.usrname}, u_id: ${user.u_id}`
      );
      logger.info(`[Socket.io] - Connected user: ${user.usrname}, u_id: ${user.u_id}`)
      //console.log(user);
    } else {
      var guest = uuid.v4();
      socket.join(guest);
      exports.guest = guest;
    }
    socket.on("my_uid",()=>{
      orgboatDB.query(
        `select u_id, pphoto, name from usrs where u_id='${user.u_id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("my_uid response", {
            user: rows
          });
        }
      );
    });
    //Transmit the messages from one user to another
    socket.on("get chats", function (msg) {
      console.log(`[Socket.io] - User ${user.usrname} asked for chats`);
      orgboatDB.query(
        `
			select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto, chats.chat_name,
        m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time,chats_users.archiveChat
        ,chats_users.delete_chat, m.unread_messages as unread_messages,  m.delete_message as deleted_message, m.delete_message_to as deleted_message_to,
        chats.groupphoto
			
			from chats_users  

			inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
			inner join usrs on usrs.u_id = chats2.u_id

			inner join chats on chats_users.chat_uid = chats.chat_uid 
			left join messages m on m.chat_uid = chats.chat_uid 
				and m.message_id = 
					(
						SELECT MAX(message_id) 
						FROM messages z 
						WHERE z.chat_uid = m.chat_uid
					)
          where chats_users.u_id = '${user.u_id}' and chats_users.archiveChat = 0 and chats_users.delete_chat = 0
          order by time desc;
			`,
        (err, rows) => {
         /* rows.forEach((chat)=>{
            orgboatDB.query( 
               `select sum(unread_messages) as unread  from messages where chat_uid = '${chat.chat_uid}' and u_id != '${user.u_id}' `,
               (err, message)=>{
                if(!message[0].unread){
                  chat.unread_messages = message[0].unread
                }
              })
            chats.push(chat)
          })*/
          io.to(user.u_id).emit("retrieve chats", {
            my_uid: user.u_id,
            chats: rows,
          });
          
        }
      );
    });

    //find archived chats
    socket.on("get chats archived", function (msg) {
      console.log(`[Socket.io] - User ${user.usrname} asked for chats`);
      orgboatDB.query(
        `
        select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto,
        m.u_id as last_message_user_uid, m.message as last_message_message, m.time as last_message_time,chats_users.archiveChat
        ,chats_users.delete_chat, m.unread_messages as unread_messages
			
			from chats_users  

			inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
			inner join usrs on usrs.u_id = chats2.u_id

			inner join chats on chats_users.chat_uid = chats.chat_uid 
			left join messages m on m.chat_uid = chats.chat_uid 
				and m.message_id = 
					(
						SELECT MAX(message_id) 
						FROM messages z 
						WHERE z.chat_uid = m.chat_uid
					)
          where chats_users.u_id = '${user.u_id}' and chats_users.archiveChat = 1 and chats_users.delete_chat = 0
          order by time desc;
			`,
        function (err, rows) {
          //console.log(rows);
          io.to(user.u_id).emit("retrieve chats archived", {
            my_uid: user.u_id,
            chats: rows,
          });
        }
      );
    });

    //Transmit the messages from one user to another
    socket.on("chat message", function (msg) {
      chat = msg.chat;
      message = msg.message;
      from = user.u_id;
      time = new Date();
      orgboatDB.query(
        `
			select * from chats_users 
			inner join chats on chats.chat_uid = chats_users.chat_uid
			where chats_users.chat_uid = '${chat}'
		`,
        function (err, chats) {
          chats.forEach((qchat) => {
            if (from != qchat.u_id) {
              io.to(qchat.u_id).emit("chat message", {
                chat: chat,
                type: qchat.chat_type,
                from: from,
                from_name: user.name,
                message: message,
                time: time,
              });
            }
          });
        }
      );
      timeDB = formatLocalDate().slice(0, 19).replace("T", " ");
      orgboatDB.query(`insert into messages(chat_uid, u_id, message,time,delete_message,unread_messages) 
                            values ('${chat}','${from}','${message}','${timeDB}',0,1)`);
    });

    //Client request the messages
    socket.on("get messages", function (msg) {
      console.log(
        `[Socket.io] - ${user.usrname} request the messages from chat: ${msg.id}, get messages:${msg.page}`
      );
      if(msg.inChat){
        orgboatDB.query(
          `UPDATE messages SET unread_messages=0 WHERE u_id!='${user.u_id}' and chat_uid='${msg.id}'`,
          (err,data)=>{
            if (err) {
              return json({
                ok: false,
                err: {
                  message: "error al actualizar messages",
                },
              });
            }
          }
        );
      }
      
      //initMsg
      orgboatDB.query(
        `
			select messages.u_id as message_user_uid, messages.message, messages.time, usrs.name, chats.chat_type , usrs.pphoto, messages.message_id, messages.delete_message, messages.delete_message_to as delete_message_to, messages.favorite,messages.favorite_to, chats.chat_uid
			from messages inner join usrs on messages.u_id = usrs.u_id
			inner join chats on chats.chat_uid = messages.chat_uid
			where  messages.chat_uid = '${msg.id}' AND messages.delete_message = 0 order by time desc limit 10;
		 `,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve messages", {
            messages: rows,
            message_user_uid: user.message_user_uid,
          });
        }
      );
    });

    socket.on("subscribingData", function (data) {
      method.subscribingData(data);
    });

    //Show profile
    socket.on("ViewProfile", function (data) {
      orgboatDB.query(
        "select usrname, pphoto,name,about,phone,city,website from usrs where u_id=(select u_id from chats_users where chat_uid = '" +
          data.id +
          "' and u_id!='" +
          user.u_id +
          "');",
        function (err, rows) {
          io.to(user.u_id).emit("retrieve viewprofile", {
            usrprofile: rows,
          });
        }
      );
    });
    // Show own profile
    socket.on("ViewOwnProfile", function (data) {
      if(!data){
        return;
      }
      orgboatDB.query(
        `select usrname, pphoto,name,about,phone,city,website from usrs where u_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve viewownprofile", {
            usrprofile: rows,
          });
        }
      );
    });
    // Save own profile
    socket.on("SaveOwnProfile", function (data) {
      //console.log(`[Socket.io] - Entro SaveOwnProfile`);
      orgboatDB.query(
        `UPDATE usrs SET name='${data.name}',about='${data.about}',phone='${data.phone}',city='${data.city}',website='${data.website}' WHERE  u_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve saveownprofile", {
            u_id: data.id,
          });
        }
      );
    });
    // Show own profile 2
    socket.on("ViewOwnProfile2", function (data) {
      orgboatDB.query(
        `select usrname, pphoto,name,about,phone,city,website from usrs where u_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve viewownprofile2", {
            usrprofile: rows,
          });
        }
      );
    });
    //Archived a chat
    socket.on("archived chat", function (chat) {
      orgboatDB.query(
        `UPDATE chats_users SET archiveChat=1 WHERE chat_uid ='${chat.chat}' and u_id='${user.u_id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("archived response");
        }
      );
    });
    //Unarchive a chat
    socket.on("Unarchive chat", function (chat) {
      orgboatDB.query(
        `UPDATE chats_users SET archiveChat=0 WHERE chat_uid ='${chat.chat}' and u_id='${user.u_id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("Unarchive response");
        }
      );
    });
    //Obtaine theme have a user
    socket.on("theme", function () {
      try {
        orgboatDB.query(
          `SELECT theme FROM usrs WHERE u_id='${user.u_id}'`,
          function (err, rows) {
            io.to(user.u_id).emit("retrive theme", {
              theme: rows,
            });
          }
        );
      } catch (e) {
        console.log(e);
      }
    });
    //Change theme user
    socket.on("change theme", () => {
      console.log("tema");
      orgboatDB.query(
        `UPDATE usrs SET theme = !theme WHERE u_id='${user.u_id}'`,
        (err, rows) => {
          io.to(user.u_id).emit("retrive change theme");
        }
      );
    });
    //For search
    socket.on("SearchUserByEmailOrUsername", (data) => {
      data.my_uid
      orgboatDB.query(
        `SELECT name,usrname,email,u_id FROM usrs WHERE email='${data.email}' or usrname='${data.usrname}'`,
        (err, rows) => {
          if(rows.length>0){
            routes.validateExistChat(rows[0].u_id, data.my_uid).then((result) => {
              if (result === false) {
                io.to(user.u_id).emit("retrive SearchUserByEmailOrUsername", {
                  users: rows,
                  validate: 0
                });
              }else{
                io.to(user.u_id).emit("retrive SearchUserByEmailOrUsername", {
                  users: [],
                  validate: 1
                });
              }
            })
          }
          else{
            io.to(user.u_id).emit("retrive SearchUserByEmailOrUsername", {
              users: [],
              validate:2
            });
          }
        }
      );
    });
    // Add new contact
    socket.on("AddContact", (data) => {
      var chat_type = 0;
      var uuid_numbr = uuid.v4();
      routes.validateExistChat(user.u_id, data.u_id).then((result) => {
        //console.log(result);
        // message = `Hola soy ${user.name} , me gustaria contactar contigo.`;
        message = data.message;
        if (result === false) {
          console.log(result);
          orgboatDB.query(
            `INSERT  INTO chats (chat_uid,chat_name,chat_type) VALUES ('${uuid_numbr}','Chat1:1',${chat_type})`
          );
          orgboatDB.query(
            `INSERT  INTO chats_users (chat_uid,u_id,archiveChat) VALUES ('${uuid_numbr}','${data.u_id}',${chat_type})`
          );
          orgboatDB.query(
            `INSERT  INTO chats_users (chat_uid,u_id,archiveChat) VALUES ('${uuid_numbr}','${user.u_id}',${chat_type})`,
            (err, data) => {
              time = new Date();
              timeDB = formatLocalDate().slice(0, 19).replace("T", " ");
              //console.log(msg);
              orgboatDB.query(`insert into messages(chat_uid, u_id, message,time,delete_message) 
                                    values ('${uuid_numbr}','${user.u_id}','${message}','${timeDB}',0)`);
              io.to(user.u_id).emit("retrive Addcontact", {
                chat: uuid_numbr,
                message,
              });
            }
          );
        }
      });
    });
    //Obtaine contacts
    socket.on("GetContacts", () => {
      console.log("contacts");
      orgboatDB.query(
        `select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto,chats_users.archiveChat

    
    from chats_users  

    inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
    inner join usrs on usrs.u_id = chats2.u_id

    inner join chats on chats_users.chat_uid = chats.chat_uid 
    where chats_users.u_id = '${user.u_id}'`,
        (err, chats) => {
          io.to(user.u_id).emit("retrive GetContacts", {
            my_uid: user.u_id,
            chats,
          });
        }
      );
    });
    //Init Message
    // socket.on("init message", (msg) => {
    //   chat = msg.chat;
    //   message = msg.message;
    //   from = user.u_id;
    //   time = new Date();
    //   timeDB = formatLocalDate().slice(0, 19).replace("T", " ");
    //   console.log(msg);
    //   orgboatDB.query(`insert into messages(chat_uid, u_id, message,time,delete_message) 
    //                         values ('${chat}','${from}','${message}','${timeDB}',0)`);
    // });
    //Delete Chat
    socket.on("Delete Chat", (chatid) => {
      orgboatDB.query(
        `UPDATE chats_users SET delete_chat = 1 WHERE chat_uid='${chatid.chat_uid}' AND u_id='${user.u_id}'`,
        (err, data) => {
          if (err) {
            return json({
              ok: false,
              err: {
                message: "No se pudo eliminar el chat",
              },
            });
          }
          orgboatDB.query(
            `UPDATE messages SET delete_message_to =1 WHERE chat_uid='${chatid.chat_uid}' AND u_id='${user.u_id}'`,
            (err, data) => {
              if (err) {
                return json({
                  ok: false,
                  err: {
                    message: "No se pudo eliminar el chat",
                  },
                });
              }
              orgboatDB.query(
                `UPDATE messages SET delete_message = 1 WHERE chat_uid='${chatid.chat_uid}' AND u_id!='${user.u_id}'`
              );
              io.to(user.u_id).emit("retrive delete chat");
            }
          );
        }
      );
    });

    //Create a new chat
    socket.on("newChat", (chat) => {
      
      orgboatDB.query(
        `SELECT archiveChat,delete_chat,chat_uid,u_id FROM chats_users WHERE chat_uid='${chat}' and u_id='${user.u_id}'`,
        (err, chats) => {
          if (err) {
            return json({
              ok: false,
              err: {
                message: "error al iniciar el chat",
              },
            });
          }
          if (chats.length >= 1) {
            console.log(chats);
            if (chats[0].delete_chat == 1) {
              orgboatDB.query(
                `UPDATE chats_users SET delete_chat = 0 WHERE chat_uid='${chat}' AND u_id='${user.u_id}'`,
                (err, data) => {
                  if (err) {
                    return json({
                      ok: false,
                      err: {
                        message: "error al iniciar el chat",
                      },
                    });
                  }
                  io.to(user.u_id).emit("retrive newchat",{
                    chat_uid:chat
                  });
                }
              );
            }
          } else {
            return json({
              ok: false,
              err: {
                message: "error no se agregado al usuario",
              },
            });
          }
        }
      );
    });
    //Get Favorites
    socket.on("GetFavorites", function (data) {
      orgboatDB.query(
        `SELECT chat_uid FROM chats_users WHERE u_id='${data.id}'`,
        function (err, rows) {
          var chat_uids = ""
          rows.forEach((data)=>{
            chat_uids +=("'"+ data.chat_uid + "',");
          })
          chat_uids = chat_uids.replace(/,\s*$/, "");
          orgboatDB.query(
            `SELECT 
            distinct messages.message, messages.time, usrs.name, message_id, messages.u_id FROM messages
            inner join usrs on messages.u_id = usrs.u_id
            inner join chats_users on messages.u_id = chats_users.u_id
            WHERE messages.favorite=1 and messages.chat_uid in (${chat_uids}) 
            and messages.u_id!='${data.id}'
            UNION 
            SELECT 
            distinct messages.message, messages.time, usrs.name, message_id, messages.u_id FROM messages
            inner join usrs on messages.u_id = usrs.u_id
            inner join chats_users on messages.u_id = chats_users.u_id
            WHERE messages.favorite_to=1 and messages.chat_uid in (${chat_uids}) 
            and messages.u_id ='${data.id}'`,
            function (err, chats) {
              io.to(user.u_id).emit("retrieve getfavorites", {
                favorites: chats,
              });
            }
          )
        }
      );
    });
    //Add Favorite
    socket.on("AddFavorite", (chat) => {
      orgboatDB.query(
        `SELECT archiveChat,delete_chat,chat_uid,u_id FROM chats_users WHERE chat_uid='${chat.chat_uid}' and u_id='${user.u_id}'`,
        (err, chats) => {
          if (err) {
            return json({
              ok: false,
              err: {
                message: "error al iniciar el chat",
              },
            });
          }
          if (chats.length >= 1) {
            console.log(chats);
            if (chats[0].delete_chat == 1) {
              orgboatDB.query(
                `UPDATE chats_users SET favorite = 0 WHERE chat_uid='${chat.chat_uid}' AND u_id='${user.u_id}'`,
                (err, data) => {
                  if (err) {
                    return json({
                      ok: false,
                      err: {
                        message: "error al iniciar el chat",
                      },
                    });
                  }
                  io.to(user.u_id).emit("retrive AddFavorite");
                }
              );
            }
          } else {
            return json({
              ok: false,
              err: {
                message: "error no se agregado al usuario",
              },
            });
          }
        }
      );
    });
    //Delete message
    socket.on("Delete message", (message) => {
      if(message.to){
        orgboatDB.query(
          `UPDATE messages SET delete_message_to=1 WHERE message_id='${message.id}'`,
          (err, data) => {
            if (err) {
              return json({
                ok: false,
                err: {
                  message: "error al eliminar chat",
                },
              });
            }
            io.to(user.u_id).emit("retrive DeleteMessage");
          }
        );
      }else{
        orgboatDB.query(
          `UPDATE messages SET delete_message=1 WHERE message_id='${message.id}'`,
          (err, data) => {
            if (err) {
              return json({
                ok: false,
                err: {
                  message: "error al eliminar chat",
                },
              });
            }
            io.to(user.u_id).emit("retrive DeleteMessage");
          }
        );
      }
      
    });

    socket.on("update notification",(data)=>{
      //console.log(`UPDATE messages SET unread_messages WHERE u_id!='${user.u_id}' and chat_uid='${data.id}'`);
        orgboatDB.query(
          `UPDATE messages SET unread_messages=0 WHERE u_id!='${user.u_id}' and chat_uid='${data.id}'`,
          (err,data)=>{
            if (err) {
              return json({
                ok: false,
                err: {
                  message: "error al actualizar messages",
                },
              });
            }
            io.to(user.u_id).emit("retrive update notification");
          }
        );
    });
    //favoriteMessage
    socket.on("FavoriteMessage", function (data) {
      orgboatDB.query(
        `UPDATE messages SET favorite=1 WHERE message_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve favoriteMessage");
        }
      );
    });
    //favoriteMessage_to
    socket.on("FavoriteMessage_to", function (data) {
      orgboatDB.query(
        `UPDATE messages SET favorite_to=1 WHERE message_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve favoriteMessage");
        }
      );
    });
    //removeFavorite
    socket.on("RemoveFavorite", function (data) {
      orgboatDB.query(
        `UPDATE messages SET favorite=0 WHERE message_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve removeFavorite");
        }
      );
    });
    //removeFavorite
    socket.on("RemoveFavorite_to", function (data) {
      orgboatDB.query(
        `UPDATE messages SET favorite_to=0 WHERE message_id='${data.id}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrieve removeFavorite");
        }
      );
    });
    //addGrupo
    socket.on("AddGrupo",function(info){
      var uuid_numbr = uuid.v4();
      var chat_type = 1;
      orgboatDB.query(
        `INSERT  INTO chats (chat_uid,chat_name,chat_type) VALUES ('${uuid_numbr}','${info.groupName}',${chat_type})`
      );
      chat_type=0;
      info.addFriends.forEach(function(friend){
        orgboatDB.query(
          `INSERT  INTO chats_users (chat_uid,u_id,archiveChat) VALUES ('${uuid_numbr}','${friend.user_chat}',${chat_type})`
        );
      })
      orgboatDB.query(
        `INSERT  INTO chats_users (chat_uid,u_id,archiveChat) VALUES ('${uuid_numbr}','${info.id}',${chat_type})`,
        (err, data) => {
          io.to(user.u_id).emit("retrive addgrupo", {
            chat: uuid_numbr,
            message: info.description,
          });
        }
      );
    });
    //get grupo
    socket.on("GetGrupo",function(data){
      orgboatDB.query(
        `select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat, usrs.name, usrs.pphoto, chats.groupphoto, chats.about_chat

        from chats_users  

        inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
        inner join usrs on usrs.u_id = chats2.u_id

        inner join chats on chats_users.chat_uid = chats.chat_uid 
            
        left join messages m on m.chat_uid = chats.chat_uid 
        and m.message_id = 
          (
            SELECT MAX(message_id)
            FROM messages z 
            WHERE z.chat_uid = m.chat_uid
          )

          where chats.chat_uid = '${data.id}' and chats_users.archiveChat = 0 and chats_users.delete_chat = 0
          group by chats2.u_id
          order by time desc;
          `,(err, rows) => {
            io.to(user.u_id).emit("retrieve GetGrupo", {
              chat_uid: data.id,
              chats: rows,
            });
            
          })
    })
    //update grupo
    socket.on("SaveGroup",function(chat){
      console.log(chat)
      orgboatDB.query(
        `UPDATE chats SET chat_name = '${chat.chat_name}' , about_chat = '${chat.about_chat}'  WHERE chat_uid ='${chat.chat_uid}'`,
        function (err, rows) {
          io.to(user.u_id).emit("retrive SaveGroup", {
            chat_uid: chat.chat_uid,
          });
        }
      );
    })

    socket.on("get group contacts",()=>{
      orgboatDB.query(
        `select chats.chat_uid, chats.chat_name, chats.chat_type, chats2.u_id as user_chat ,usrs.name,usrs.pphoto,chats_users.archiveChat

    
          from chats_users  

          inner join chats_users chats2 on chats2.chat_uid = chats_users.chat_uid
          inner join usrs on usrs.u_id = chats2.u_id

          inner join chats on chats_users.chat_uid = chats.chat_uid 
          where chats_users.u_id = '${user.u_id}'`,
        (err, chats) => {
          io.to(user.u_id).emit("retrieve groups", {
            my_uid: user.u_id,
            chats,
          });
        }
      );
    });
  } catch {
    console.log("problema");
  }
});
