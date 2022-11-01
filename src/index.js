                                /* proyect index 
                                npm run dev         */

const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
//const mongoose = require("mongoose");

//settings
app.set("port", process.env.PORT || 3000)

/*Database connection
const uri ="mongodb://localhost:27017/chatsWebPage";
const connect = mongoose.connect( uri,{ useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on("open", _ =>{
    console.log("database is conectect to", uri);
});*/

//static files
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//starting the server
const server = http.createServer(app);
server.listen(app.get("port"), () =>{
    console.log("server on port: ", app.get("port"));
});

/* Socket.IO is a library that enables real-time, bidirectional and event-based 
communication between the browser and the server. It consists of: */
const io = socketio(server);
require("./sockets")(io);