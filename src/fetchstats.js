import fetch from 'node-fetch';
import querystring from 'querystring';
import writeInfluxStats from './dbstats';

const MarketParams = {
    datasource: 'tranquility',
    order_type: 'all',
    page: 1,
    type_id: 44992
};

const MarketDataURL = "https://esi.tech.ccp.is/latest/markets/10000002/orders/?" + querystring.stringify(MarketParams);

function ReportError(reason) {
    console.log(reason);
}

fetch(MarketDataURL, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json()).catch(ReportError).then(function(data) {
        AggregateStats(data);
    }).catch(ReportError);

const DEPTH_METER = 100000; // One hundred thousand

function AggregateStats(data) {
    var buys = data.filter(v => v.is_buy_order).sort((a, b) => b.price - a.price);
    var sells = data.filter(v => !v.is_buy_order).sort((a, b) => a.price - b.price);

    var highestBuy = Math.max.apply(Math, buys.map(v => v.price));
    var lowestSell = Math.min.apply(Math, sells.map(v => v.price));
    var bidSpread = lowestSell - highestBuy;
    var marketDepth = sells.reduce((acc, val, i) => ((val.price < (lowestSell + DEPTH_METER)) ? (acc + val.volume_remain) : acc), 0);

    writeInfluxStats(highestBuy, lowestSell, bidSpread, marketDepth);
}

export default 'Complete';
