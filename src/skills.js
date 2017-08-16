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
