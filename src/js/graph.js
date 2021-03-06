var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthPosts = new Array();
var monthLikes = new Array();
var monthComments = new Array();
var dailyData = new Array();
var activeTime = new Array();

function renderEventsGraph() {
    $('#events-container').highcharts({
        chart: {
            type: 'gauge',
            backgroundColor:'rgba(255, 255, 255, 0.4)',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: '',
            style:{
                fontFamily:"impact"}
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
                text: 'n%',
                style:{
                fontFamily:"impact"},
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

function processEventGraph(uid, name, type){
    $('body').addClass('loading');
    var d = new Date();
    var end = d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDay());
    d.setDate(d.getDate()-26);
    var start = d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDay());
    getEvents(uid, name, type, start, end, renderEventsGraph1);
}

function renderEventsGraph1(data, startDate, name, type) {
    $('body').removeClass('loading');
    $('#events-container').highcharts({
        chart: {
            type: 'heatmap',
            backgroundColor:'rgba(255, 255, 255, 0.4)',
        },

        exporting: {
            url: 'http://export.highcharts.com/',
            enabled: false
        },

        credits: {
            enabled: false
        },

        title: {
            text: type+' - '+name,
            style: {
                 color: '#36525E',
                 fontSize: '18px',
                 fontWeight: 'bold',
                 fontFamily:"impact"
                }
            
        },

        xAxis: {
            categories: ['', '', '', '', '', '']
        },

        yAxis: {
            categories: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5'],
            title: null,
            style:{
                fontWeight:'light',
                fontSize:'16px',
                style:{
                fontFamily:"impact"}
            }
            
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
                temp = new Date(startDate);
                increment = this.point.y*6+this.point.x;
                temp.setDate(temp.getDate()+increment);
                return '<b>Events: </b><br><b>' + this.point.value + '</b> events on ' + temp.toString().substring(0, 15) + '<br>';
            }
        },

        plotOptions: {
              series: {
                 shadow: true
              },
              candlestick: {
                 lineColor: 'white'
              },
              map: {
                 shadow: true
              }
           },
 
        series: [{
            name: 'Events Per Day',
            borderWidth: 1,
            data: data,
            dataLabels: {
                enabled: true,
                color: 'grey',
                style: {
                    textShadow: 'none',
                    HcTextStroke: null
                }
            }
        }]

    });
}

function renderMonthPostGraph(uid, name, type){

    var currMon = (new Date()).getMonth()+1;
    var lastMon = currMon - 1;
    if (currMon == 1) {
        lastMon = 12;
    }

    if (monthPosts[uid]) {
        renderLineGraph("Number of Posts", " posts", name, type, monthPosts[uid][0], 
            currMon-1, lastMon-1, monthPosts[uid][2], monthPosts[uid][1]);
    } else {
        $.getJSON( "backend.php", {data: 'month', uid: uid}, function( data ) {
            
            var fields = $.map(data.fields, function(el) { return el; });
            var lastMonth = $.map(data.lastmonth, function(el) { return el; });
            var thisMonth = $.map(data.thismonth, function(el) { return el; });

            monthPosts[uid] = [fields, lastMonth, thisMonth];
        
            renderLineGraph("Number of Posts", " posts", name, type, fields, currMon-1, lastMon-1, thisMonth, lastMonth);
        });
    }
}

function renderMonthLikeGraph(uid, name, type){
    $('body').addClass('loading');
    var currMon = (new Date()).getMonth()+1;
    var lastMon = currMon - 1;
    if (currMon == 1) {
        lastMon = 12;
    }

    if (monthLikes[uid]) {
        renderLineGraph("Number of Likes", " likes", name, type, monthLikes[uid][0], 
            currMon-1, lastMon-1, monthLikes[uid][1], monthLikes[uid][2]);
    } else {
        getNumberOfLikesInMonth(uid, currMon, function(currResult){
            getNumberOfLikesInMonth(uid, lastMon, function(lastResult){
                var fields = new Array();
                var currLikes = new Array();
                var lastLikes = new Array();
                for (var i = 0; i < Math.max(currResult.length, lastResult.length); i++) {
                    if (i < currResult.length) {
                        currLikes.push(currResult[i]);
                    }
                    if (i < lastResult.length) {
                        lastLikes.push(lastResult[i]);
                    }
                    fields.push(i+1);
                }
                monthLikes[uid] = [fields, currLikes, lastLikes];
                renderLineGraph("Number of Likes", " likes", name, type, fields, currMon-1, lastMon-1, currLikes, lastLikes);
            });
        });
    }
}

function renderMonthCommentGraph(uid, name, type){
    $('body').addClass('loading');
    var currMon = new Date().getMonth()+1;
    var lastMon = currMon - 1;
    if (currMon == 1) {
        lastMon = 12;
    }
    
    if (monthComments[uid]) {
        renderLineGraph("Number of Comments", " comments", name, type, monthComments[uid][0], 
            currMon-1, lastMon-1, monthComments[uid][1], monthComments[uid][2]);
    } else {
        getNumberOfCommentsInMonth(uid, currMon, function(currResult){
            getNumberOfCommentsInMonth(uid, lastMon, function(lastResult){
                var fields = new Array();
                var currComments = new Array();
                var lastComments = new Array();
                for (var i = 0; i < Math.max(currResult.length, lastResult.length); i++) {
                    if (i < currResult.length) {
                        currComments.push(currResult[i]);
                    }
                    if (i < lastResult.length) {
                        lastComments.push(lastResult[i]);
                    }
                    fields.push(i+1);
                }
                monthComments[uid] = [fields, currComments, lastComments];
                renderLineGraph("Number of Comments", " comments", name, type, fields, currMon-1, lastMon-1, currComments, lastComments);
            });
        });
    }
}

function renderLineGraph(title, suffix, name, type, fields, currMon, lastMon, currLikes, lastLikes) {
    $('body').removeClass('loading');
    var option = {
        exporting: {
            url: 'http://export.highcharts.com/',
            enabled: false
        },
        chart: {
            backgroundColor:'rgba(255, 255, 255, 0.4)',
        },    
        credits: {
            enabled: false
        },
        title: {
            text: type+' - '+name,
            style:{
                fontFamily:"impact"},
            x: -20 //center
            },
            subtitle: {
                text: 'Source: Facebook.com',
                x: -20,
                style:{
                fontFamily:"Gill Sans"}
            },
            plotOptions: {
                series: {
                    threshold: 0,
                }
            },
            xAxis: {
                //from outside data 
                categories: fields
            },
            yAxis: {
                title: {
                    style:{
                fontFamily:"Gill Sans"},
                    text: title
                },
                plotLines: [{
                    value: 1,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: suffix
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 1
            },
            series: [{
                name: month[lastMon],
                style:{
                fontFamily:"Gill Sans"},
                color: '#53777F',
                dashStyle: 'Dot',
                shadow:'true',
                //from outside data
                data: lastLikes
            },
            {
                name: month[currMon],

                style:{
                fontFamily:"Gill Sans"},
                color: '#FB4642',
                dashStyle: 'Dot',
                    shadow: 'true',
                //from outside data
                data: currLikes
            }]
        }

    $('#monthly-container').highcharts(option);
}

function renderDailyDataGraph(uid, name, type){
    if (dailyData[uid]) {
        drawPieGraph(name, type, dailyData[uid], 'of all posts');
    } else {
        $.getJSON( "backend.php",{data: 'type', uid: uid}, function( data ) {
            var elements = new Array();

            for (var i = data.fields.length - 1; i >= 0; i--) {
                var field = data.fields[i];
                var ratio = data.data[i];
                elements.push([field, ratio]);
            };

            dailyData[uid] = elements;
            drawPieGraph(name, type, elements, 'of all posts');
        });
    }
}

function renderActiveDistribution(uid, name, type){
    if (activeTime[uid]) {
        drawPieGraph(name, type, activeTime[uid], ' of all posts');
    } else {
        $.getJSON( "backend.php",{data: 'active_time', uid: uid}, function( data ) {
            var elements = new Array();
            var count = 0;
            var timeDurations = new Array("08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00",
                                        "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00",
                                        "20:00 - 22:00", "22:00 - 00:00", "00:00 - 02:00", 
                                        "02:00 - 04:00", "04:00 - 06:00", "06:00 - 08:00");
            
            for (var i = 0; i< 12 ; i++) {
                count += Number(data.activity[i]);
            };

            for (var i = 0; i < 12; i++) {
                var field = timeDurations[i];
                var ratio = data.activity[i] / count;
                elements.push([field, ratio]);
            };

            activeTime[uid] = elements;
            drawPieGraph(name, type, elements, ' of all posts');
        });
    }
}


function drawPieGraph(name, type, elements, seriesName) {
    var option = {
        chart: {
            backgroundColor:'rgba(255, 255, 255, 0.4)',
            style: {
              fontFamily: "Gill Sans, serif"
           }
        },

        colors: ["#F6D286", "#FFCB43", "#D0E4A7", "#92D8D5", "#82CEC3", "#6EC4DF", "#0093C4", "#A2AEBC", "#FF9999","#D25B5E" ,"#FB8C64", "#F66B52" ],
        

        exporting: {
            url: 'http://export.highcharts.com/',
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: type+' - '+name,
            style:{
                fontFamily:"impact"},
        },

        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b> {series.name}'
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
            name: seriesName,
            data: elements,
            style:{
                fontFamily:"Gill Sans"},
        }]
    }

    $('#daily-container').highcharts(option);
}

function pad(d) {
    return (d<10) ? '0'+d.toString() : d.toString();
}
