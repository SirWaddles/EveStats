import fetch from 'node-fetch';
import Types from '../data/types';

var PriceList = [];

function RefreshPrices() {
    fetch("https://esi.tech.ccp.is/latest/markets/prices/?datasource=tranquility", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json()).then(function(data) {
        PriceList = data;
    })
}

RefreshPrices();

export {RefreshPrices}

function GetModulePrice(id) {
    return PriceList.filter(v => v.type_id === id).reduce((acc, v) => v.average_price, 0);
}

function GetModulePrices(modlist) {
    return modlist.map(v => GetModulePrice(v.id) * v.amount).reduce((a, b) => a+b, 0);
}

function GetModuleName(typeid) {
    return Types.filter(v => v.type_id == typeid)[0];
}

export {GetModuleName};

setInterval(RefreshPrices, 86400000);

function PrettyNumber(val) {
    if (!val && val !== 0) return "IDFK";
    return val.toFixed(2).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}

var PRICE_REQUESTS = [];

function GetPriceType(message, params) {
    var requests = PRICE_REQUESTS.filter(v => v.author == message.author);
    if (requests.length > 0) {
        PRICE_REQUESTS = PRICE_REQUESTS.filter(v => v.author != message.author);
        var index = parseInt(params[1]);
        if (Number.isNaN(index)) {
            message.channel.send("Sorry, guess I couldn't help.");
            return;
        }
        var request = requests[0];
        var typeData = request.results[index - 1];
        message.channel.send('Current price of **' + typeData.typeName + '** is ' + PrettyNumber(GetModulePrice(typeData.typeID)));
        return;
    }
    params.shift();
    var typeName = params.join(' ');
    var results = Types.filter(v => v.typeName.indexOf(typeName) !== -1);
    var exacts = results.filter(v => v.typeName == typeName);
    if (exacts.length > 0) {
        message.channel.send('Current price of **' + exacts[0].typeName + '** is ' + PrettyNumber(GetModulePrice(exacts[0].typeID)));
        return;
    }
    if (results.length == 1) {
        message.channel.send('Current price of **' + results[0].typeName + '** is ' + PrettyNumber(GetModulePrice(results[0].typeID)));
        return;
    }
    if (results.length <= 0) {
        message.channel.send("Sorry, I couldn't find that item.");
        return;
    }

    PRICE_REQUESTS.push({
        author: message.author,
        results: results,
        query: typeName,
    });

    var resultString = results.slice(0, 10).map((v, i) => "**" + (i + 1) + "**: " + v.typeName).join("\n");
    message.channel.send("I'm not really sure what you're looking for. Is it one of these?\n" + resultString);
}

export {GetModulePrice, GetModulePrices, GetPriceType};
