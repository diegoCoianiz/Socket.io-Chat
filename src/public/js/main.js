                                    /* CLIENT SIDE 
interfaz*/

$(function () {
    const socket = io();

    /* obtaining DOM elements from the nickNameForm */
    const $nickForm = $("#nickForm");
    const $nickName = $("#nickName");
    const $nickError = $("#nickError");

    /* obtaining DOM elements from interface */
    const $messageForm = $("#message-form");
    const $chat = $("#chat");
    const $messageBox = $("#message");

    /* obtaining DOM elements from the userNameForm */
    const $userNames = $("#userNames");

     /* obtaining DOM elements from the cardHeader */
     const $cardHeader = $("#card-header");

    /*-------------------------/*

    /*New User and Nicknames events */   
    $nickForm.submit ( e => {
        e.preventDefault();
        console.log("sending '", $nickName.val(), "'");
        socket.emit("new user", $nickName.val(), data => {
            if (data) 
            {
                $("#nickWrap").hide();
                $("#contentWrap").show();
                $cardHeader.append("<h4> Hello " + $nickName.val() + " " + '<i class="fas fa-user-circle"></i>'); 
                console.log(data);
            }
            else 
            {
                $nickError.html(`
                    <div class="alert alert-danger">
                        That username already exist.
                        <br>Please try with a diferent one.
                    </div>
                    `);
            }
        $nickName.val("");
        });
    })

    /* add new users to the list */
    socket.on("nicknames", data => {
        html = "";
        for (let i = 0; i < data.length; i++){
        html += `<p><i class="fas fa-user"></i>${" " + data[i]}</p>`;
        }; 
        $userNames.html(html);  
    });

    /* Message events */
    $messageForm.submit ( e => {
        e.preventDefault();
        socket.emit("send message", $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val("");
    });

    socket.on("new message", function (data){
        $chat.append("<b>" + data.nick + ": </b>" + data.msg + "<br/>"); 
    })

    socket.on("private", data => {
        $chat.append(`<p class="private"><i class="fas fa-user-secret"></i> From <b>${data.nick}</b> to <b>${data.fromUser}: </b> ${data.privUserMsj}</p>`);
    })

    socket.on("load old msgs", data => {
        console.log("la data: ", data.length);
        for (let i = 0; i < data.length; i++) {
            console.log("item data: ", data[i], i)
            displayMsg(data[i]);
        }
    })
    function displayMsg(data) {
        $chat.append("<b>" + data.nick + ": </b>" + data.msg + "<br/>");
    };
});
