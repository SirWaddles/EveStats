import Discord from 'discord.js';
import approx from 'approximate-number';
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

function FetchDatabaseStats(measurement, time) {
    const fullQuery = "SELECT highestBuy, lowestSell FROM plex.autogen." + measurement + " WHERE time > now() - " + time + "d";
    return influx.query(fullQuery);
}

function SendGraphImage(message, params) {
    var measurement = 'plex_price';
    var time = 1;
    if (params.length >= 1 && params[0] === 'skill') {
        measurement = 'skill_price';
    }
    var title = "Plex Buy/Sell Price";
    if (measurement == 'skill_price') {
        title = 'Large Skill Injector';
    }
    if (params.length >= 2) {
        time = parseInt(params[1]);
        if (Number.isNaN(time)) {
            message.reply('Sorry, you must be a dope! Try a real number.');
            return;
        }
    }
    FetchDatabaseStats(measurement, time).then(function(r) {
        return BuildGraph(TranslateToHighcharts(r, 'highestBuy'), TranslateToHighcharts(r, 'lowestSell'), title);
    }).then(function(graphBuffer) {
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
    });
}

const PlexPriceUSD = [
    [110, 5],
    [240, 10],
    [500, 20],
    [1100, 40],
    [2860, 100],
    [7430, 250],
    [15400, 500],
];

function IskPackages(message, params) {
    FetchDatabaseStats('plex_price', 1).then(function(data) {
        var plexprice = data.pop().lowestSell;
        var text = PlexPriceUSD.map(v => 'Buy **' + approx(plexprice * v[0]) + '** isk for **$' + v[1] + '**');
        message.channel.send(text.join("\n"));
    });
}

function PlexSkillPrice(plexprice, skillprice, plexrate) {
    return (skillprice / plexprice) * plexrate;
}

function SkillPriceCount(plexprice, skillprice, plexcount) {
    return (plexprice / skillprice) * plexcount;
}

import {EFTFitStats} from './fits';
import {AuthorizeBot, AddResponseType} from './auth';
import {ListSkillQueue, DisplayAvatar} from './skills';
import HelpCommand from './help';
import {JimmyStart} from './jimmy';
import {GetPriceType, GetModuleName} from './prices';

function DefaultCommand(message, params) {
    message.channel.send("Sorry, I can't figure out what you want. Type `plexbot help` to see my commands.");
}

// Hobogoblin/Voyager/Jimmy Pings
AddResponseType('pings', function(req, params) {
    req.on('data', function(body) {
        var data = JSON.parse(body);
        data.forEach(function(ping) {
            if (ping.target == 'dm') {
                client.fetchUser(ping.discord).then(function(user){
                    if (!user) return;
                    user.send('We are now connected to **' + ping.name + '** (' + ping.system + ')');
                });
            }
            if (ping.target == 'intel') {
                client.channels.forEach(function(channel) {
                    if (channel.id == '232332546220883968') {
                        channel.send('We are now connected to **' + ping.name + '** (' + ping.system + ')');
                    }
                });
            }
            if (ping.target == 'public') {
                client.channels.forEach(function(channel) {
                    if (channel.id == '309487614724145154') {
                        channel.send('@Public_pings We are now connected to **' + ping.name + '** (' + ping.system + ')');
                    }
                });
            }
        });
    });
    return true;
});

AddResponseType('kbs', function(req, params) {
    req.on('data', function(body) {
        var data = JSON.parse(body);
        client.channels.forEach(function(channel) {
            if (channel.id == '232332546220883968') {
                var ship = GetModuleName(data.kb.killmail.victim.ship_type_id);
                channel.send('A ' + ship.typeName + ' just blew up in ' + data.kb.system.nickname);
            }
        });
    });
    return true;
});

const MessageActions = {
    default: DefaultCommand,
    'plex': SendGraphImage,
    'skill': SendGraphImage,
    'price': GetPriceType,
    'isk': IskPackages,
    'authorize': AuthorizeBot,
    'authorise': AuthorizeBot,
    'training': ListSkillQueue,
    'help': HelpCommand,
    'voyager': JimmyStart,
    'avatar': DisplayAvatar,
};

client.on('message', message => {
    if (message.content.slice(0, 5) == "```\n[") {
        EFTFitStats(message);
    }
    if (message.content.slice(0, 7) === 'plexbot') {
        var params = message.content.slice(7).trim().split(' ');
        if (params.length <= 0 || !MessageActions.hasOwnProperty(params[0])) {
            MessageActions.default(message, params);
            return;
        }

        MessageActions[params[0]](message, params);
    }
});

client.login(DiscordToken);
