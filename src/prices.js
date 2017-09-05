import fetch from 'node-fetch';

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

export {GetModulePrice, GetModulePrices};
