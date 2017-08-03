import {InfluxDB, FieldType} from 'influx';

const influx = new InfluxDB({
    host: 'localhost',
    database: 'plex',
    schema: [
        {
            measurement: 'plex_price',
            fields: {
                highestBuy: FieldType.INTEGER,
                lowestSell: FieldType.INTEGER,
                bidSpread: FieldType.INTEGER,
                marketDepth: FieldType.INTEGER,
            },
            tags: [],
        }
    ]
});

export default influx;
