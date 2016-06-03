/**
 * Created by alter on 06.05.2016.
 */

$(document).ready(function () {
    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Arial', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '16px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };
// Apply the theme
    Highcharts.setOptions(Highcharts.theme);

    Global.container = $("#trend");
    Global.container_forecast = $(".forecast_trend");
    Global.trendSetting = {
        credits:{enabled:false},
        chart: {
            zoomType: 'x',
            height:300,
            renderTo:Global.container[0],            
        },
        title: {
            text: 'График эмоционального состояния'
        },
        legend: {
            //enabled: true
        },
        xAxis: {
            type: 'datetime',
            gridLineWidth:1,
            //ordinal:false,
        },
        yAxis: {
            title: {
                text: 'Эмоции'
            },
            floor:0,
            ceiling:100
        },
        rangeSelector:{
            buttons:[{
                type:"hour",
                count:1,
                text:"1ч"
            },{
                type:"hour",
                count:3,
                text:"3ч"
            },{
                type:"hour",
                count:8,
                text:"8ч"
            },{
                type:"day",
                count:1,
                text:"1д"
            },{
                type:"week",
                count:1,
                text:"7д"
            },{
                type:"all",
                text:"Все"
            }],
            selected:3,
            //inputEnabled:false
        },
        navigator:{
            height:15
        },
        scrollbar:{
            enabled:false
        },
        plotOptions: {
            series: {
                threshold:40,
                negativeColor:'red',
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 5
                    }
                }
            }
        },
        series:[{
            id:'emo',
            type: 'areaspline',
            name: 'Эмоциональное состояние',
            //data:[0,0],
            lineWidth: 4,
            dataLabels:{
                enabled:true,
            },
            tooltip: {
                valueDecimals: 0,
                valueSuffix:' emo'
            },
            color:"lightgreen"
        },{
            type: 'flags',
            linkedTo:':previous',
            //data:[],
            shape:'squarepin',
            onSeries:'emo',
            y:-40
        }]
    };
    Global.trendForecastSetting = {
        chart: {
            zoomType: 'x',
            height:270,
            renderTo:Global.container_forecast[0],
        },
        title: {
            text: 'Прогноз'
        },
        credits:{
            enabled:false
        },
        xAxis: {
            type: 'datetime',
            crosshair: true
            //ordinal:false,
        },
        yAxis:[{
            title: {
                text: 'Температура'
            }
        },{
            title: {
                text: 'Влажность'
            },
            floor:0,
            ceiling:100,
            opposite:true
        },{
            title: {
                text: 'Дождь'
            },
            floor:0,
            opposite:true
        }],        
        tooltip:{
            shared:true
        },
        plotOptions: {
            column:{
                states:{
                    hover:{
                        brightness:-0.5,
                        color:"grey"
                    }
                }
            },
            spline:{
                states:{
                    hover:{
                        lineWidth: 5
                    }
                }
            }
        },
        series:[{
            type: 'spline',
            name: 'Температура',
            //data:[1,2,3,4,5,6,7,8,69],
            lineWidth: 2,
            color:"orange",
            tooltip: {
                valueDecimals: 1,
                valueSuffix:" C"
            },
            zIndex:4
        },{
            type: 'spline',
            name: 'Влажность',
            //data:[1,2,3,4,5,6,7,8,69],
            lineWidth: 2,
            tooltip: {
                valueDecimals: 0,
                valueSuffix:" %"
            },
            color:"cyan",
            yAxis:1,
            zIndex:3
        },{
            type: 'column',
            name: 'Дождь',
            //data:[1,2,3,4,5,6,7,8,69],
            tooltip: {
                valueDecimals: 2,
                valueSuffix:" мм"
            },
            color:"darkgrey",
            yAxis:2,
            linkedTo:":previous",
            zIndex:2
        }]
    };
    Global.trend = new Highcharts.StockChart(Global.trendSetting);
    Global.trend_forecast = new Highcharts.Chart(Global.trendForecastSetting);
    
});
