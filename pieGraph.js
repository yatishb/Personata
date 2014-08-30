$(document).ready(function() {
    $.getJSON( "pieGraphJSON.php", function( data ) {
        var elements = new Array();

        for (var i = data.fields.length - 1; i >= 0; i--) {
            var field = data.fields[i];
            var ratio = data.data[i];
            elements.push([field, ratio]);
        };

        var option = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 1,//null,
                plotShadow: false
            },
            credits: {
                //enabled: false
                text: 'Personata',
                href: 'https://apps.facebook.com/personata-app/'
            },
            title: {
                text: 'Type of your posts'
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
 
        $('#pieGraph').highcharts(option);    
    });

    $('#share').click(function () {
        var chart = $('#pieGraph').highcharts(),
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
