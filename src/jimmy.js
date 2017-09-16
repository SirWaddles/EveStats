import crypto from 'crypto';
import qs from 'querystring';
import {GetCharacters} from './dbstore';
import {ValidateCharacter, AddResponseType} from './auth';

var JIMMY_TOKENS = [];

function JimmyStart(message, params) {
    GetCharacters(message.author.id).then(ValidateCharacter).then(function(character) {
        var statestring = crypto.randomBytes(20).toString('hex');

        var existing_token = JIMMY_TOKENS.filter(v => v.owner == message.author.id);
        if (existing_token.length > 0) {
            statestring = existing_token[0].state;
        } else {
            JIMMY_TOKENS.push({
                state: statestring,
                owner: message.author.id,
            });
        }

        message.author.send("Check this out! :slight_smile:\nhttps://jimmy.genj.io/?key=" + statestring);
    }).catch(function(e) {
        message.reply("You can't use Jimmy without authentication");
    });
}

AddResponseType('character', function(req, params) {
    var qsObj = qs.parse(params[2].split('?')[1]);
    var token = JIMMY_TOKENS.filter(v => v.state == qsObj.key);
    if (token.length <= 0) return {error: true};
    token = token[0];

    return GetCharacters(token.owner).then(ValidateCharacter);
});

export {JimmyStart};
