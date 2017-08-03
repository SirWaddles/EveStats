import Discord from 'discord.js';
import DiscordToken from './discordtoken';
const client = new Discord.Client();

import influx from './database';
import {BuildGraph} from './chart';

const fullQuery = "SELECT highestBuy, lowestSell FROM plex.autogen.plex_price";

function TranslateToHighcharts(data, property) {
    return data.map(v => [
        v.time.getTime(),
        v[property]
    ]);
}

function FetchDatabaseStats() {
    return influx.query(fullQuery).then(function(results) {
        return BuildGraph(TranslateToHighcharts(results, 'highestBuy'), TranslateToHighcharts(results, 'lowestSell'));
    });
}

client.on('message', message => {
    if (message.content === 'ping') {
        FetchDatabaseStats().then(function(graphBuffer) {
            message.reply('U R DUM', {
                files: [
                    {
                        attachment: graphBuffer,
                        name: 'chart.png',
                    }
                ]
            });
        })
    }
});

client.login(DiscordToken);
