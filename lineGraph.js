$(document).ready(function() {

    $.getJSON( "lineGraphJSON.php", function( data ) {
        var option = {
                
            credits: {
                //enabled: false
                text: 'Personata',
                href: 'https://apps.facebook.com/personata-app/'
            },
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

        $('#lineGraph').highcharts(option);
    });

    $('#share').click(function () {
        var chart = $('#lineGraph').highcharts(),
            svg = chart.getSVG();
            
        var canvas = document.createElement( "canvas" );
        var ctx = canvas.getContext( "2d" );
        var img = document.createElement( "img" );
        img.setAttribute( "src", "data:image/svg+xml;base64," + btoa(svg));
        ctx.canvas.width  = img.width;
        ctx.canvas.height = img.height;
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            window.open( canvas.toDataURL( "image/png" ) );
        };
    });
});