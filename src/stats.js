const DEPTH_METER = 100000; // One hundred thousand

function AggregateStats(data) {
    var buys = data.filter(v => v.is_buy_order).sort((a, b) => b.price - a.price);
    var sells = data.filter(v => !v.is_buy_order).sort((a, b) => a.price - b.price);

    var highestBuy = Math.max.apply(Math, buys.map(v => v.price));
    var lowestSell = Math.min.apply(Math, sells.map(v => v.price));

    return {
        highestBuy: highestBuy,
        lowestSell: lowestSell,
        bidSpread: lowestSell - highestBuy,
        marketDepth: sells.reduce((acc, val, i) => ((val.price < (lowestSell + DEPTH_METER)) ? (acc + val.volume_remain) : acc), 0),
    };
}

export default AggregateStats;
