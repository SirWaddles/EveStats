import {InfluxDB} from 'influx';
import influx from './database';

function writeInfluxStats(data) {
    influx.writePoints([{
        measurement: 'plex_price',
        fields: data,
        tags: {},
    }])
}

export default writeInfluxStats;
