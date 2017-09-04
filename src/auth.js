import http from 'http';
import qs from 'querystring';
import fetch from 'node-fetch';
import crypto from 'crypto';
import {OAuth2} from 'oauth';
import {Hobgoblin} from './discordtoken';

var ONGOING_AUTH = [];

function AuthorizeBot(message, params) {
    var statestring = crypto.randomBytes(20).toString('hex');
    ONGOING_AUTH.push({
        state: statestring,
        message: message,
        stage: 'start',
    });
    var url = "https://eve.genj.io/oauth/" + statestring;
    message.author.send("Hey, awesome! Use this link, thanks :smile:\n" + url);
}

export {AuthorizeBot};

const oauth2 = new OAuth2(Hobgoblin.client_id,
                        Hobgoblin.secret_key,
                        'https://login.eveonline.com/',
                        'oauth/authorize',
                        'oauth/token',
                        null);

function writeResponse(res, response) {
    res.writeHead(200, {
        'Content-Length': response.length,
        'Content-Type': 'text/html',
    });
    res.end(response);
}

function ValidateCharacter(character) {
    var expires = new Date(character.expires * 1000);
    var today = new Date();
    if (today > expires) {
        return GetNewAccessToken(character.refresh_token).then(function(e) {
            expires = (today.getTime() / 1000) + (e.expires * 60);
            var newcharacter = {
                character_id: character.character_id,
                discord_id: character.discord_id,
                character_name: character.character_name,
                access_token: e.access_token,
                refresh_token: e.refresh_token,
                expires: expires,
            };
            RegisterCharacter(character.character_id, character.discord_id, character.character_name, e.access_token, e.refresh_token, expires);
            return newcharacter;
         });
    }
    return Promise.resolve(character);
}

export {ValidateCharacter};

import {RegisterCharacter} from './dbstore';

function GetCharactersWithData(authstate) {
    return fetch("https://login.eveonline.com/oauth/verify", {
        headers: {
            'Authorization': 'Bearer ' + authstate.access_token,
        },
        method: 'GET',
    }).then(r => r.json()).then(function(data) {
        RegisterCharacter(data.CharacterID, authstate.message.author.id, data.CharacterName, authstate.access_token, authstate.refresh_token);
        authstate.message.reply('Hey, thanks! **' + data.CharacterName + '** is registered to you.');
    });
}

function GetNewAccessToken(refresh_token) {
    return new Promise((resolve, reject) => {
        oauth2.getOAuthAccessToken(refresh_token, {
            redirect_uri: 'https://eve.genj.io/oauth/key/',
            grant_type: 'refresh_token',
        }, function(e, access_token, refresh_token, results) {
            if (e) {
                console.log(e);
                reject(e);
                return;
            }
            if (results.error) {
                console.log(results);
                reject(results);
                return;
            }
            resolve({
                access_token: access_token,
                refresh_token: refresh_token,
                expires: results.expires,
            });
        });
    });
}

export {GetNewAccessToken};

http.createServer(function(req, res) {
    var params = req.url.split('/');
    if (params.length <= 2) {
        writeResponse(res, "not valid");
        return;
    }

    if (params[2].indexOf('key') === 0) {
        var qsObj = qs.parse(params[2].split('?')[1]);
        oauth2.getOAuthAccessToken(
            qsObj.code,
            {
                redirect_uri: 'https://eve.genj.io/oauth/key/',
                grant_type: 'authorization_code',
            },
            function (e, access_token, refresh_token, results) {
                if (e) {
                    res.end(JSON.stringify(e));
                    return;
                }
                if (results.error) {
                    res.end(JSON.stringify(results));
                    return;
                }
                var authstate = ONGOING_AUTH.filter(v => v.state == qsObj.state);
                if (authstate.length <= 0) return;
                authstate[0].access_token = access_token;
                authstate[0].refresh_token = refresh_token;
                authstate[0].stage = 'tokens';
                GetCharactersWithData(authstate[0]);
                writeResponse(res, "Thanks! Should be working now.");
            }
        );
        return;
    }

    var authstate = ONGOING_AUTH.filter(v => v.state == params[2]);
    if (authstate.length > 0) {
        var authURL = oauth2.getAuthorizeUrl({
            redirect_uri: 'https://eve.genj.io/oauth/key',
            scope: ['esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-markets.structure_markets.v1'],
            state: authstate[0].state,
            response_type: 'code',
        });
        authstate[0].stage = 'request';

        res.writeHead(302, {
            'Location': authURL,
        });
        res.end();
        return;
    }
    writeResponse(res, "not valid");
}).listen(8091);
