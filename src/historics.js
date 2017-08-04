import fs from 'fs';
import readline from 'readline';

/*const csvstream = fs.createReadStream('data/2017-07-31.dump');

const reader = readline.createInterface({
    input: csvstream,
});

function createOrderObject(fields) {
    return {
        orderid: parseInt(fields[0]),
        regionid: parseInt(fields[1]),
        systemid: parseInt(fields[2]),
        stationid: parseInt(fields[3]),
        typeid: parseInt(fields[4]),
        bid: ((fields[5] == '1') ? true : false),
        price: Math.floor(parseFloat(fields[6])),
        minvolume: parseInt(fields[7]),
        volremain: parseInt(fields[8]),
        volenter: parseInt(fields[9]),
        issued: new Date(fields[10]),
        duration: fields[11],
        range: parseInt(fields[12]),
        // reportedBy: parseInt(fields[13]),
        reportedtime: new Date(fields[14]),
    };
}

var totalOrders = 0;
var totalFilteredOrders = 0;

var orderList = [];

reader.on('line', function(line) {
    var fields = line.slice(1, -1).split('","');
    if (fields[0] == 'orderid' ) return;
    var data = createOrderObject(fields);
    totalOrders++;
    if (data.regionid == 10000002 && data.typeid == 44992) {
        orderList.push(data);
        totalFilteredOrders++;
    }
});

reader.on('close', function() {
    AggregateOrderList(orderList);
});

*/

import AggregateStats from './stats';

const SHORT_CHUNK_TIME = (1000 * 60 * 60); // 20 minutes
const LONG_CHUNK_TIME =  (1000 * 60 * 60 * 24 * 2); // 1 day

function RemapDates(v) {
    v.reportedtime = new Date(v.reportedtime);
    v.issued = new Date(v.issued);
    return v;
}

function RemapToESI(v) { // Just price stuff for now
    return {
        volume_remain: v.volremain,
        price: v.price,
        is_buy_order: v.bid,
    };
}

AggregateOrderList(JSON.parse(fs.readFileSync('./data.json', 'utf-8')).map(RemapDates));

function CalculateOrderStats(orders, startTime) {
    if (orders.length <= 0) return;
    console.log(AggregateStats(orders.map(RemapToESI)));
    console.log(startTime);
}

function AggregateOrderList(orderList) {
    var startDate = orderList[0].reportedtime;
    var endDate = new Date(startDate.getTime() + SHORT_CHUNK_TIME);
    var finalDate = new Date(startDate.getTime() + LONG_CHUNK_TIME);

    while (startDate < finalDate) {
        CalculateOrderStats(orderList.filter(v => v.reportedtime >= startDate && v.reportedtime <= endDate), startDate);
        startDate = new Date(startDate.getTime() + SHORT_CHUNK_TIME);
        endDate = new Date(endDate.getTime() + SHORT_CHUNK_TIME);
    }
}
