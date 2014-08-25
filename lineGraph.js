$(document).ready(function() {


    $.getJSON( "lineGraphJSON.php", function( data ) {
        var option = {
            title: {
                text: 'Monthly Posts',
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
                name: 'You',
                color: '#0066FF',
                //dashStyle: 'ShortDash',
                //from outside data
                data: data.data
            }]
        }

        $('#container').highcharts(option);
    });
});