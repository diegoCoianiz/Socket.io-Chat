                                    /* SERVER SIDE */
//const chats = require("./models/chats")

module.exports = function(io){
    var nickNames = {};
    console.log("database nick names at this moment are: ", Object.keys(nickNames));
   
    function updateNicknames() {
        io.sockets.emit("nicknames", Object.keys(nickNames));
    };

    io.on("connection", async socket => {
        console.log("new user connected"); 

        let messages = ""//await chats.find({}).sort({$natural:-1}).limit(5);
        socket.emit("load old msgs", messages);

        socket.on("new user", (data, cb) =>{
            console.log("user's chosen nick name: ", data);
                if (data in nickNames) {
                cb(false);
                console.log(data, "already exist on the database: ", Object.keys(nickNames))
            }
            else {
                cb(true);
                socket.nickname = data;
                nickNames[socket.nickname] = socket;
                updateNicknames();
                console.log('"', data, '" was added to the database: ', Object.keys(nickNames));
            };
        });
 
        socket.on("send message", async (data, cb) => {
            /* (/p)   (nickname)     (message) */
            var msg = data.trim();
            /* (/p) (nickname) (message) */
            if (msg.substr(0,3) === "/p ") {
                msg = msg.substr(3);
                /* (nickname) (message) */
                const index = msg.indexOf(" ");
                if (index !== -1) {
                    let privUserName = msg.substr(0, index);
                    /* (nickname) */
                    let privUserMsj = msg.substr(index + 1)
                    /* (message) */
                    if (privUserName in nickNames) {
                        nickNames[privUserName].emit("private", {
                            privUserMsj,
                            nick: socket.nickname,
                            fromUser: privUserName
                        });
                        nickNames[socket.nickname].emit("private", {
                            privUserMsj,
                            nick: socket.nickname,
                            fromUser: privUserName
                        });
                    }
                    else {
                        cb("Error! please enter a valid user nickname.");
                    }
                }
                else {
                cb("Eror! please enter your message.");
                }
            }
            else {
                /*var newMessage = new chats({
                    msg: data,
                    nick: socket.nickname 
                });
                await newMessage.save();
                console.log(newMessage.nick, ":", newMessage.msg, ". Saved")*/

                io.sockets.emit("new message", {
                msg: data,
                nick: socket.nickname
                });
            };
    });

        socket.on("disconnect", data => {
            if(!socket.nickname) return;
            delete nickNames[socket.nickname];
            console.log(socket.nickname, "was removed to the database: ", nickNames.nickname);
            updateNicknames();
        });
    });
};

/*socket. is a client - server connection
io. is an all clients - server connection */