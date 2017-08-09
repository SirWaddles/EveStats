import MessageStore from './client/MessageStore';

const socketClient = new WebSocket("wss://eve.genj.io/wss");
socketClient.onmessage = function(event) {
    var msgData = JSON.parse(event.data);
    if (msgData.type === 'sylver') {
        MessageStore.addMessage({
            content: 'Sylver did a thing: ' + msgData.message,
        });
    }
    if (msgData.type === 'mention') {
        MessageStore.addMessage({
            content: msgData.author + ' mentioned: ' + msgData.message,
        });
    }
}

import React from 'react';
import ReactDOM from 'react-dom';
import Application from './client/Application';

window.addEventListener("load", function() {
    ReactDOM.render(React.createElement(Application, null), document.getElementById("app-widget"));
});
