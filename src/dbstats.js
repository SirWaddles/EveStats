import {InfluxDB} from 'influx';
import influx from './database';

function writeInfluxStats(data, measurement) {
    influx.writePoints([{
        measurement: measurement,
        fields: data,
        tags: {},
    }])
}

export default writeInfluxStats;
