import exporter from 'highcharts-export-server';

exporter.initPool();

function BuildGraph(data1, data2, title) {
    return new Promise(function(resolve, reject) {
        var exportSettings = {
            type: 'png',
            options: {
                title: {
                    text: title
                },
                xAxis: {
                    type: 'datetime',
                },
                series: [
                    {
                        type: 'line',
                        data: data1,
                        name: 'Buy Price',
                    },
                    {
                        type: 'line',
                        data: data2,
                        name: 'Sell Price',
                    }
                ],
                chart: {
                    width: 1280,
                    height: 720,
                },
                line: {
                    marker: {
                        enabled: false,
                    }
                }
            }
        };

        exporter.export(exportSettings, function (err, res) {
            resolve(Buffer.from(res.data, 'base64'));
        });
    })
}

export {BuildGraph};

function EndPool() {
    exporter.killPool();
}

process.on('exit', EndPool);

export {EndPool};
