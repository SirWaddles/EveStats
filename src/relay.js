var ActiveRelays = [];

function ClearRelays(author) {
    ActiveRelays = ActiveRelays.filter(v => v.author !== author);
}

function RelayMessage(message, params) {
    ClearRelays(message.author);
    ActiveRelays.push({
        author: message.author,
        channel: message.channel,
    });
}

export { RelayMessage };

function DirectMessage(message) {
    var relay = ActiveRelays.filter(v => v.author == message.author);
    if (relay.length <= 0) return;
    relay = relay[0];

    relay.channel.send(message.content);
    ClearRelays(message.author);
}

export { DirectMessage };
