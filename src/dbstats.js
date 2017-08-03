import {InfluxDB} from 'influx';
import influx from './database';

function writeInfluxStats(highestBuy, lowestSell, bidSpread, marketDepth) {
    influx.writePoints([{
        measurement: 'plex_price',
        fields: {
            highestBuy: highestBuy,
            lowestSell: lowestSell,
            bidSpread: bidSpread,
            marketDepth: marketDepth,
        },
        tags: {},
    }])
}

export default writeInfluxStats;
