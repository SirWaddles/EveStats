import Discord from 'discord.js';
import DiscordToken from './discordtoken';
const client = new Discord.Client();

import influx from './database';
import {BuildGraph} from './chart';

import {AddAction, BroadcastMessage} from './server.js'; // Start the WebSocket server.

function TranslateToHighcharts(data, property) {
    return data.map(v => [
        v.time.getTime(),
        v[property]
    ]);
}

function FetchDatabaseStats(measurement, time) {
    const fullQuery = "SELECT highestBuy, lowestSell FROM plex.autogen." + measurement + " WHERE time > now() - " + time + "d";
    var title = "Plex Buy/Sell Price";
    if (measurement == 'skill_price') {
        title = 'Large Skill Injector';
    }
    return influx.query(fullQuery).then(function(results) {
        return BuildGraph(TranslateToHighcharts(results, 'highestBuy'), TranslateToHighcharts(results, 'lowestSell'), title);
    });
}

client.on('message', message => {
    if (message.mentions.users.has(client.user.id)) {
        BroadcastMessage({
            type: 'mention',
            message: message.content,
            author: message.author.username,
        });
    }
    if (message.author.id == '171926582414409728') {
        BroadcastMessage({
            type: 'sylver',
            message: message.content,
        });
    }
    if (message.content.slice(0, 7) === 'plexbot') {
        var params = message.content.slice(7).trim().split(' ');
        var measurement = 'plex_price';
        var time = 1;
        if (params.length >= 1 && params[0] === 'skill') {
            measurement = 'skill_price';
        }
        if (params.length >= 2) {
            time = parseInt(params[1]);
            if (Number.isNaN(time)) {
                message.reply('Sorry, you must be a dope! Try a real number.');
                return;
            }
        }
        FetchDatabaseStats(measurement, time).then(function(graphBuffer) {
            message.reply('Here you go', {
                files: [
                    {
                        attachment: graphBuffer,
                        name: 'chart.png',
                    }
                ]
            }).then(function(message) {
                message.delete(1000 * 60 * 10); // 10 minutes
            });
        })
    }
});

client.login(DiscordToken);
