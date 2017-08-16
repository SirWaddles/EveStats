import fetch from 'node-fetch';
import querystring from 'querystring';

const JSON_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

function ReportError(reason) {
    console.log(reason);
}

function FindCharacterNames(ids) {
    if (ids.length > 10) ids = ids.slice(0, 10);
    const urlparams = {
        datasource: 'tranquility',
        character_ids: ids.join(','),
    };

    const namesUrl = "https://esi.tech.ccp.is/latest/characters/names/?" + querystring.stringify(urlparams);
    return fetch(namesUrl, {
        headers: JSON_HEADERS,
        method: 'GET',
    }).then(r => r.json()).catch(ReportError);
}

function FindCharacterIDs(query) {
    const urlparams = {
        categories: 'character',
        datasource: 'tranquility',
        search: query,
        strict: false,
    };

    const searchUrl = "https://esi.tech.ccp.is/latest/search/?" + querystring.stringify(urlparams);

    return fetch(searchUrl, {
        headers: JSON_HEADERS,
        method: 'GET',
    }).then(r => r.json()).catch(ReportError).then(function(data) {
        return FindCharacterNames(data.character);
    });
}

import {RegisterCharacter} from './dbstore';
var REGISTER_REQUESTS = [];

function ReceiveRegister(message, params) {
    if (params[1] == 'cancel') {
        REGISTER_REQUESTS = REGISTER_REQUESTS.filter(v => v.discord_token != message.author.id);
        message.reply('Okay, but get it right this time.');
        return;
    }
    var requests = REGISTER_REQUESTS.filter(v => v.discord_token == message.author.id);
    if (requests.length > 0) {
        var request = requests[0];
        var chosenOption = parseInt(params[1]);
        if (Number.isNaN(chosenOption)) {
            message.reply('Not a valid option');
            return;
        }
        if (chosenOption > request.results.length) {
            message.reply('Not a valid option');
            return;
        }
        var finalRes = request.results[chosenOption - 1];
        RegisterCharacter(finalRes.character_id, message.author.id, finalRes.character_name);
        message.reply('Your character **' + finalRes.character_name + '** was registered to @<' + message.author.id + '>');
        REGISTER_REQUESTS = REGISTER_REQUESTS.filter(v => v.discord_token != message.author.id);
        return;
    }
    params.shift();
    var query = params.join(' ');
    FindCharacterIDs(query).then(function(v) {
        if (v.length == 1) {
            RegisterCharacter(v[0].character_id, message.author.id, v[0].character_name);
            message.reply('Your character **' + v[0].character_name + '** was registered to <@' + message.author.id + '>');
            return;
        }
        message.reply("Multiple characters were found with that query. Please type *plexbot register 1* or the correct option to choose a character.\n" + v.map((r, i) => ('**' + (i+1) + '**. ' + r.character_name)).join("\n"));
        REGISTER_REQUESTS.push({
            discord_token: message.author.id,
            results: v
        });
    });
}

export {ReceiveRegister};
