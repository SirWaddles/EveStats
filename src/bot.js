import Discord from 'discord.js';
import DiscordToken from './discordtoken';
const client = new Discord.Client();

import influx from './database';
import {BuildGraph} from './chart';

function TranslateToHighcharts(data, property) {
    return data.map(v => [
        v.time.getTime(),
        v[property]
    ]);
}

function FetchDatabaseStats(measurement) {
    const fullQuery = "SELECT highestBuy, lowestSell FROM plex.autogen." + measurement + " WHERE time > now() - 24h";
    var title = "Plex Buy/Sell Price";
    if (measurement == 'skill_price') {
        title = 'Large Skill Injector';
    }
    return influx.query(fullQuery).then(function(results) {
        return BuildGraph(TranslateToHighcharts(results, 'highestBuy'), TranslateToHighcharts(results, 'lowestSell'), title);
    });
}

client.on('message', message => {
    if (message.content.slice(0, 7) === 'plexbot') {
        var measurement = 'plex_price';
        if (message.content.slice(7) === 'skill') {
            measurement = 'skill_price';
        }
        FetchDatabaseStats(measurement).then(function(graphBuffer) {
            message.reply('Here you go', {
                files: [
                    {
                        attachment: graphBuffer,
                        name: 'chart.png',
                    }
                ]
            }).then(function(message) {
                message.delete(60000);
            });
        })
    }
});

client.login(DiscordToken);
