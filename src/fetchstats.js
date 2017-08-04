import fetch from 'node-fetch';
import querystring from 'querystring';
import writeInfluxStats from './dbstats';
import AggregateStats from './stats';

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
        writeInfluxStats(AggregateStats(data));
    }).catch(ReportError);
