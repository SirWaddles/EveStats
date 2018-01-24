import {Client, xml, jid, xmpp} from '@xmpp/client';
import {JabberKey} from './discordtoken';

const client = new Client();

client.start({
    uri: 'xmpp://jabber.pleaseignore.com',
    domain: 'pleaseignore.com',
}).catch(err => console.error(err.message));

client.handle('authenticate', auth => {
    return auth(JabberKey.username, JabberKey.password);
});


client.on('error', err => {
  console.error('X:', err.toString())
})

client.on('status', (status, value) => {
    // console.log('I:', status, value ? value.toString() : '')
})

client.on('online', jid => {
    client.send(xml('presence'));
    // console.log('O:', 'online as', jid.toString())
})

client.on('stanza', stanza => {
    // idk
})

client.on('element', element => {
    if (element.name == 'message') {
        console.log(element.attrs.from);
        console.log(element.getChild('body').text());
    }
})
