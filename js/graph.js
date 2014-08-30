function renderEventsGraph() {
    $('#events-container').highcharts({
        chart: {
            type: 'gauge',
            backgroundColor:'rgba(255, 255, 255, 0)',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: ''
        },

        credits: {
          enabled: false
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'n%'
            },
            plotBands: [{
                from: 0,
                to: 50,
                color: '#55BF3B' // green
            }, {
                from: 50,
                to: 80,
                color: '#DDDF0D' // yellow
            }, {
                from: 80,
                to: 100,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: 'Social Index',
            data: [50],
            tooltip: {
                valueSuffix: '% people are beaten'
            }
        }]

    },
        // Add some life
        function (chart) {
            if (!chart.renderer.forExport) {
                setInterval(function () {
                    var point = chart.series[0].points[0],
                        newVal,
                        inc = Math.round((Math.random() - 0.5) * 5);

                    newVal = point.y + inc;
                    if (newVal < 0 || newVal > 100) {
                        newVal = point.y - inc;
                    }

                    point.update(newVal);

                }, 3000);
            }
        });
}

function renderEventsGraph1() {
    $('#events-container').highcharts({

        chart: {
            type: 'heatmap',
            backgroundColor:'rgba(255, 255, 255, 0.2)',
        },

        title: {
            text: ''
        },

        xAxis: {
            categories: ['', '', '', '', '', '']
        },

        yAxis: {
            categories: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5'],
            title: null
        },

        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 320
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
        },

        series: [{
            name: 'Events Per Day',
            borderWidth: 1,
            data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92],
                    [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], 
                    [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], 
                    [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], 
                    [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120]],
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    textShadow: 'none',
                    HcTextStroke: null
                }
            }
        }]

    });
}

function renderMonthDataGraph(){
    $.getJSON( "../lineGraphJSON.php", function( data ) {
        var option = {
            chart: {
                backgroundColor:'rgba(255, 255, 255, 0.2)',
            },    
            credits: {
                //enabled: false
                text: 'Personata',
                href: 'https://apps.facebook.com/personata-app/'
            },
            title: {
                text: '',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: Facebook.com',
                x: -20
            },
            plotOptions: {
                series: {
                    threshold: 0,
                }
            },
            xAxis: {
                //from outside data 
                categories: data.fields
            },
            yAxis: {
                title: {
                    text: 'Number of Posts'
                },
                plotLines: [{
                    value: 1,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' Posts'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 1
            },
            series: [{
                name: 'This Month',
                color: '#0066FF',
                dashStyle: 'ShortDash',
                //from outside data
                data: data.thisMonth
            }, 
            {
                name: 'Last Month',
                color: '#8A2BE2',
                dashStyle: 'ShortDash',
                //from outside data
                data: data.lastMonth
            }]
        }

        $('#monthly-container').highcharts(option);
    });
}

function renderDailyDataGraph(){
    $.getJSON( "../pieGraphJSON.php", function( data ) {
        var elements = new Array();

        for (var i = data.fields.length - 1; i >= 0; i--) {
            var field = data.fields[i];
            var ratio = data.data[i];
            elements.push([field, ratio]);
        };

        var option = {
            chart: {
                backgroundColor:'rgba(255, 255, 255, 0.2)',
            },
            credits: {
                //enabled: false
                text: 'Personata',
                href: 'https://apps.facebook.com/personata-app/'
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Posts type',
                data: elements
            }]
        }
 
        $('#daily-container').highcharts(option);
    });
}