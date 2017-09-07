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

function SkillPrices(message, params) {
    Promise.all([
        FetchDatabaseStats('plex_price', 1),
        FetchDatabaseStats('skill_price', 1),
    ]).then(function(data) {
        var plexprice = data[0].pop().lowestSell;
        var skillprice = data[1].pop().highestBuy;
        var totals = PlexPriceUSD.map(v => ({
            val: v[1],
            costper: PlexSkillPrice(plexprice, skillprice, v[1] / v[0]),
            countper: SkillPriceCount(plexprice, skillprice, v[0]),
            count: v[0],
        }));
        var text = totals.map(v => 'Price is **$' + v.costper.toFixed(2) + '** when buying *' + v.count + '* plex or **' + Math.floor(v.countper) + '** for $' + v.val);
        message.channel.send(text.join("\n"));
    });
}

import {EFTFitStats} from './fits';
import {AuthorizeBot} from './auth';
import {ListSkillQueue} from './skills';
import HelpCommand from './help';

const MessageActions = {
    default: SendGraphImage,
    'plex': SendGraphImage,
    'skill': SendGraphImage,
    'price': SkillPrices,
    'isk': IskPackages,
    'authorize': AuthorizeBot,
    'training': ListSkillQueue,
    'help': HelpCommand,
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
