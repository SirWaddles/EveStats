import fs from 'fs';
import {Client, xml, jid, xmpp} from '@xmpp/client';
import {JabberKey} from './discordtoken';

const client = new Client();
const PingListens = [];

function AddJabberPingListen(listener) {
    PingListens.push(listener);
}

if (JabberKey) {
    client.start({
        uri: 'xmpp://jabber.pleaseignore.com',
        domain: 'pleaseignore.com',
    }).catch(err => console.error(err.message));
}

client.handle('authenticate', auth => {
    return auth(JabberKey.username, JabberKey.password);
});


client.on('error', err => {
  console.error('X:', err.toString())
});

client.on('status', (status, value) => {
    // console.log('I:', status, value ? value.toString() : '')
});

client.on('online', jid => {
    client.send(xml('presence'));
    // console.log('O:', 'online as', jid.toString())
});

client.on('stanza', stanza => {
    // idk
});

const TEST_PING_MATCH = (/#### SENT BY ([\w ]+) to ([\w/ ]+) @/g);

client.on('element', element => {
    if (element.name == 'message') {
        if (element.attrs.from == 'pleaseignore.com' || element.attrs.from == 'authbot@pleaseignore.com') {
            var message = element.getChild('body').text();
            TEST_PING_MATCH.lastIndex = 0;
            var data = TEST_PING_MATCH.exec(message);
            if (!data) {
                console.error('Ping body text: ' + message);
                return;
            }
            PingListens.forEach(v => v(message, data[1], data[2]));
        }
    }
});

export {AddJabberPingListen};
