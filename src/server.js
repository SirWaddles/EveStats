import * as WebSocket from 'ws';

const wss = new WebSocket.Server({port: 8010});
const wsActions = {};

function AddAction(type, callb) {
    wsActions[type] = callb;
}

function BroadcastMessage(msg) {
    wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

export {AddAction, BroadcastMessage};

function ParseMessage(msg) {
    var data = {};
    try {
        data = JSON.parse(msg);
    } catch (e) {
        console.log(e.message);
        return;
    }

    if (!data.hasOwnProperty('type')) return;
    if (!wsActions.hasOwnProperty(data.type)) return;

    wsActions[data.type](this, msg);
}

wss.on('connection', function(client) {
    client.on('message', ParseMessage);
    if (wsActions.hasOwnProperty('startup')) {
        client.send(JSON.stringify(wsActions.startup()));
    }
});
