import crypto from 'crypto';
import qs from 'querystring';
import {GetAllCharacters, GetJimmyKey, CreateJimmyKey, GetJimmyOwner} from './dbstore';
import {ValidateCharacter, AddResponseType} from './auth';

function JimmyStart(message, params) {
    GetAllCharacters(message.author.id).then(ValidateCharacter).then(function(character) {
        GetJimmyKey(message.author.id).then(function(key) {
            message.author.send("Here's your key! :slight_smile:\nhttps://voyager.genj.io/?key=" + key.key);
        }).catch(function(e) {
            var statestring = crypto.randomBytes(20).toString('hex');
            CreateJimmyKey(message.author.id, statestring);
            message.author.send("Here's your key! :slight_smile:\nhttps://voyager.genj.io/?key=" + statestring);
        });
    }).catch(function(e) {
        message.reply("You can't use Voyager without authentication");
    });
    message.delete(10000);
}

AddResponseType('character', function(req, params) {
    var qsObj = qs.parse(params[2].split('?')[1]);
    return GetJimmyOwner(qsObj.key).then(d => d.discord_id).then(GetAllCharacters).then(ValidateCharacter).catch(function(e) {
        console.error(e);
        return {error: 'no auth'};
    });
});

export {JimmyStart};
