import fetch from 'node-fetch';
import querystring from 'querystring';
import writeInfluxStats from './dbstats';
import AggregateStats from './stats';

const PLEX_TYPE = 44992;
const SKILL_TYPE = 40520;

function BuildMarketURL(type_id) {
    const MarketParams = {
        datasource: 'tranquility',
        order_type: 'all',
        page: 1,
        type_id: type_id,
    };
    const MarketDataURL = "https://esi.tech.ccp.is/latest/markets/10000002/orders/?" + querystring.stringify(MarketParams);
    return MarketDataURL;
}

function ReportError(reason) {
    console.log(reason);
}

fetch(BuildMarketURL(PLEX_TYPE), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json()).catch(ReportError).then(function(data) {
        writeInfluxStats(AggregateStats(data), 'plex_price');
    }).catch(ReportError);

fetch(BuildMarketURL(SKILL_TYPE), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then(r => r.json()).catch(ReportError).then(function(data) {
        writeInfluxStats(AggregateStats(data), 'skill_price');
    }).catch(ReportError);
