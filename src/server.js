import {Server as WebSocketServer} from 'ws';

const ws = new WebSocketServer({port: 8010});

ws.on('open', function() {
    console.log('test');
});
