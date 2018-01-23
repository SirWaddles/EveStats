import fetch from 'node-fetch';
import {GetCharacterByName} from './dbstore';
import {ValidateOneCharacter} from './auth';

function GetCharacterLocation(character) {
    return fetch("https://esi.tech.ccp.is/latest/characters/" + character.character_id + "/location",{
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + character.access_token,
        },
        method: 'GET',
    }).then(r => r.json());
}

function GetCharacterOnline(character) {
    return fetch("https://esi.tech.ccp.is/latest/characters/" + character.character_id + "/online",{
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + character.access_token,
        },
        method: 'GET',
    }).then(r => r.json());
}

function GetLocationId(message, params) {
    GetCharacterByName(params[1])
        .then((v) => ValidateOneCharacter(v, true))
        .then(GetCharacterLocation)
        .then(function(data) {
            message.channel.send(data.solar_system_id);
        });
}

export {GetLocationId};
