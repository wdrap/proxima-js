;(function() {
    'use strict'
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)'
    };
    var costChartConfig = {
        type: 'line',
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Cost'
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    gridLines: {
                        color: 'rgb(78,78,78)'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Epoch'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(78, 78, 78, 1)'
                    },
                    ticks: {
                        beginAtZero: false,
                        suggestedMin: 0,
                        suggestedMax: .5
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Cost'
                    }
                }]
            }
        }
    }
    var accuracyChartConfig = {
        type: 'line',
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Accuracy in percentage'
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    gridLines: {
                        color: 'rgb(78,78,78)'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Epoch'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(78, 78, 78, 1)'
                    },
                    ticks: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 100
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Accuracy'
                    }
                }]
            }
        }
    }
    var spinner

    var refreshView = function(data) {
        var colorNames = Object.keys(chartColors);
        var colorName = colorNames[costChartConfig.data.datasets.length % colorNames.length];
        var newColor = chartColors[colorName];

        var costDataset = {
            label: 'η ' + clamp.lr,
            fill: false,
            backgroundColor: newColor,
            borderColor: newColor,
            borderWidth: 1,
            data: data.cost
        }
        costChartConfig.data.datasets.push(costDataset)
        window.costChart.update()

        var accuracyDataset = {
            label: Number(data.accuracy[data.accuracy.length - 1].y).toFixed(2) + ' %',
            fill: false,
            backgroundColor: newColor,
            borderColor: newColor,
            borderWidth: 1,
            data: data.accuracy
        }
        accuracyChartConfig.data.datasets.push(accuracyDataset)
        window.accuracyChart.update()
        spinner.stop()
    }

    var initView = function() {
        var ctx = document.getElementById('costChart').getContext('2d');
        ctx.canvas.parentNode.style.width = "800px";
        ctx.canvas.parentNode.style.height = "800px";
        window.costChart = new Chart(ctx, costChartConfig)

        var ctx1 = document.getElementById('accuracyChart').getContext('2d');
        ctx1.canvas.parentNode.style.width = "800px";
        ctx1.canvas.parentNode.style.height = "800px";
        window.accuracyChart = new Chart(ctx1, accuracyChartConfig)

        spinner = new Spinner({
            lines: 7, // The number of lines to draw
            length: 30, // The length of each line
            width: 12, // The line thickness
            radius: 25, // The radius of the inner circle
            scale: 1, // Scales overall size of the spinner
            corners: 1, // Corner roundness (0..1)
            color: '#ffffff', // CSS color or array of colors
            fadeColor: 'transparent', // CSS color or array of colors
            speed: .7, // Rounds per second
            rotate: 0, // The rotation offset
            animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
            direction: 1, // 1: clockwise, -1: counterclockwise
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            top: '50%', // Top position relative to parent
            left: '50%', // Left position relative to parent
            shadow: '0 0 1px transparent', // Box-shadow for the lines
            position: 'absolute' // Element positioning
        })

        clamp.nn = '4,4,3'
        clamp.lr = .01
        clamp.cf = 'MSE'
        clamp.ct = 0.002
        clamp.me = 25000
        clamp.le = 100
        clamp.trainingData = "[\n" + "{ \"inputs\": [5.1,3.5,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.9,3.0,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.7,3.2,1.3,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.6,3.1,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.6,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.4,3.9,1.7,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.6,3.4,1.4,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.4,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.4,2.9,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.9,3.1,1.5,0.1], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.4,3.7,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.8,3.4,1.6,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.8,3.0,1.4,0.1], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.3,3.0,1.1,0.1], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.8,4.0,1.2,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.7,4.4,1.5,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.4,3.9,1.3,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.5,1.4,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.7,3.8,1.7,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.8,1.5,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.4,3.4,1.7,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.7,1.5,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.6,3.6,1.0,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.3,1.7,0.5], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.8,3.4,1.9,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.0,1.6,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.4,1.6,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.2,3.5,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.2,3.4,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.7,3.2,1.6,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.8,3.1,1.6,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.4,3.4,1.5,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.2,4.1,1.5,0.1], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.5,4.2,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.9,3.1,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.2,1.2,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.5,3.5,1.3,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.9,3.6,1.4,0.1], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.4,3.0,1.3,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.4,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.5,1.3,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.5,2.3,1.3,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.4,3.2,1.3,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.5,1.6,0.6], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.8,1.9,0.4], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.8,3.0,1.4,0.3], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.1,3.8,1.6,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [4.6,3.2,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.3,3.7,1.5,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [5.0,3.3,1.4,0.2], \"targets\": [1,0,0] },\n" +
            "{ \"inputs\": [7.0,3.2,4.7,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.4,3.2,4.5,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.9,3.1,4.9,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.5,2.3,4.0,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.5,2.8,4.6,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.7,2.8,4.5,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.3,3.3,4.7,1.6], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [4.9,2.4,3.3,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.6,2.9,4.6,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.2,2.7,3.9,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.0,2.0,3.5,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.9,3.0,4.2,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.0,2.2,4.0,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.1,2.9,4.7,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.6,2.9,3.6,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.7,3.1,4.4,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.6,3.0,4.5,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.8,2.7,4.1,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.2,2.2,4.5,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.6,2.5,3.9,1.1], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.9,3.2,4.8,1.8], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.1,2.8,4.0,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.3,2.5,4.9,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.1,2.8,4.7,1.2], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.4,2.9,4.3,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.6,3.0,4.4,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.8,2.8,4.8,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.7,3.0,5.0,1.7], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.0,2.9,4.5,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.7,2.6,3.5,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.5,2.4,3.8,1.1], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.5,2.4,3.7,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.8,2.7,3.9,1.2], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.0,2.7,5.1,1.6], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.4,3.0,4.5,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.0,3.4,4.5,1.6], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.7,3.1,4.7,1.5], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.3,2.3,4.4,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.6,3.0,4.1,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.5,2.5,4.0,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.5,2.6,4.4,1.2], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.1,3.0,4.6,1.4], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.8,2.6,4.0,1.2], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.0,2.3,3.3,1.0], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.6,2.7,4.2,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.7,3.0,4.2,1.2], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.7,2.9,4.2,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.2,2.9,4.3,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.1,2.5,3.0,1.1], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [5.7,2.8,4.1,1.3], \"targets\": [0,1,0] },\n" +
            "{ \"inputs\": [6.3,3.3,6.0,2.5], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.8,2.7,5.1,1.9], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.1,3.0,5.9,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.3,2.9,5.6,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.5,3.0,5.8,2.2], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.6,3.0,6.6,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [4.9,2.5,4.5,1.7], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.3,2.9,6.3,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.7,2.5,5.8,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.2,3.6,6.1,2.5], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.5,3.2,5.1,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.4,2.7,5.3,1.9], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.8,3.0,5.5,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.7,2.5,5.0,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.8,2.8,5.1,2.4], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.4,3.2,5.3,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.5,3.0,5.5,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.7,3.8,6.7,2.2], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.7,2.6,6.9,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.0,2.2,5.0,1.5], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.9,3.2,5.7,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.6,2.8,4.9,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.7,2.8,6.7,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.3,2.7,4.9,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.7,3.3,5.7,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.2,3.2,6.0,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.2,2.8,4.8,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.1,3.0,4.9,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.4,2.8,5.6,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.2,3.0,5.8,1.6], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.4,2.8,6.1,1.9], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.9,3.8,6.4,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.4,2.8,5.6,2.2], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.3,2.8,5.1,1.5], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.1,2.6,5.6,1.4], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [7.7,3.0,6.1,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.3,3.4,5.6,2.4], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.4,3.1,5.5,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.0,3.0,4.8,1.8], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.9,3.1,5.4,2.1], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.7,3.1,5.6,2.4], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.9,3.1,5.1,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.8,2.7,5.1,1.9], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.8,3.2,5.9,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.7,3.3,5.7,2.5], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.7,3.0,5.2,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.3,2.5,5.0,1.9], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.5,3.0,5.2,2.0], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [6.2,3.4,5.4,2.3], \"targets\": [0,0,1] },\n" +
            "{ \"inputs\": [5.9,3.0,5.1,1.8], \"targets\": [0,0,1] }]"
        clamp.tl = 'Iris-setosa,Iris-versicolor,Iris-virginica'
    }

    function init() {
        initView()

        document.querySelector('.button_train')
            .addEventListener('click', function () {
                var worker = new Worker('scripts/worker.js')
                worker.postMessage(clamp)
                worker.addEventListener('message', function(e) {
                    refreshView(e.data)
                    var file = window.URL.createObjectURL(new Blob([e.data.state], {type: 'application/json'}))
                    document.querySelector('.button_export').href = file
                }, false)
                spinner.spin(document.body)
            })

        document.querySelector('.button_reset')
            .addEventListener('click', function () {
                costChartConfig.data.datasets.splice(0, costChartConfig.data.datasets.length)
                window.costChart.update()

                accuracyChartConfig.data.datasets.splice(0, accuracyChartConfig.data.datasets.length)
                window.accuracyChart.update()
            })
    }

    init()
})()
