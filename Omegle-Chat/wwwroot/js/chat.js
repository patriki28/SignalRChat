"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message, isJoin) {
    if (isJoin) {
        alert(user + " joined the room!");
    }
    else {
        var div = document.createElement("div");
        if (user === document.getElementById("userInput").value) {
            div.classList.add("sent-message");
        } else {
            div.classList.add("received-message");
        }
        document.getElementById("messagesList").appendChild(div);

        var name = document.createElement("div");
        name.classList.add("message-name");
        name.textContent = user;
        div.appendChild(name);

        var text = document.createElement("div");
        text.classList.add("message-text");
        text.textContent = message;
        div.appendChild(text);
    }
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var room = document.getElementById("room").value;
    connection.invoke("SendMessage", user, message, room, false).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("joinButton").addEventListener("click", function (event) {

    var room = document.getElementById("room").value;
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message, room, true).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("leaveButton").addEventListener("click", function (event) {
    connection.invoke("LeaveRoom", room).catch(function (err) {
        return console.error(err.toString());
    });

    // reset the message list
    var messagesList = document.getElementById("messagesList");
    while (messagesList.firstChild) {
        messagesList.removeChild(messagesList.firstChild);
    }

    event.preventDefault();
});

window.onbeforeunload = function (event) {
    var room = document.getElementById("room").value;
    var user = document.getElementById("userInput").value;
    connection.invoke("SendMessage", user, "left the room.", room, false).catch(function (err) {
        return console.error(err.toString());
    });

    var confirmationMessage = 'Are you sure you want to leave the room?';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
};