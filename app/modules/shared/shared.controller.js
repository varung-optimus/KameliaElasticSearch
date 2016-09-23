(function(app) {

    app.controller('SharedController', SharedController);
    SharedController.$inject = ['$scope', '$timeout', '$mdSidenav', 'esClient',
        'euiContentTypeQuery', 'euiAccessQuery', 'euiModificationsQuery'
    ];

    function SharedController($scope, $timeout, $mdSidenav, esClient,
        euiContentTypeQuery, euiAccessQuery, euiModificationsQuery) {
        var shared = this;
        var isRendered = false;

        shared.openGraphEditModal = function() {
            var popup = new Foundation.Reveal($('#popup-modal'));
            popup.open();
        };

        shared.toggleLeft = buildDelayedToggler('left');
        shared.toggleRight = buildToggler('right');
        shared.isOpenRight = function() {
            return $mdSidenav('right').isOpen();
        };

        shared.close = function(side) {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(side).close();
        };

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle();
            }, 200);
        }

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle();
            }
        }

        /* Pie chart on Home */
        var pieColor = 'rgba(255, 204, 0, 0.6)';
        shared.charts = [{
            color: pieColor,
            description: 'kpi-1',
            stats: '57,820',
            icon: 'user-plus',
        }, {
            color: pieColor,
            description: 'kpi-2',
            stats: '$ 89,745',
            icon: 'dollar',
        }, {
            color: pieColor,
            description: 'kpi-3',
            stats: '178,391',
            icon: 'user',
        }, {
            color: pieColor,
            description: 'kpi-4',
            stats: '32,592',
            icon: 'refresh',
        }];

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function loadPieCharts() {
            $('.chart').each(function() {
                var chart = $(this);
                chart.easyPieChart({
                    easing: 'easeOutBounce',
                    onStep: function(from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    },
                    barColor: chart.attr('rel'),
                    trackColor: 'rgba(0,0,0,0)',
                    size: 84,
                    scaleLength: 0,
                    animation: 2000,
                    lineWidth: 9,
                    lineCap: 'round',
                });
            });

            $('.refresh-data').on('click', function() {
                updatePieCharts();
            });
        }

        function updatePieCharts() {
            $('.pie-charts .chart').each(function(index, chart) {
                $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
            });
        }

        $timeout(function() {
            loadPieCharts();
            updatePieCharts();
        }, 1000);
        /* End */

        /* Donut Chart */
        //SASS mix function
        function mix(color1, color2, weight) {
            // convert a decimal value to hex
            function d2h(d) {
                return d.toString(16);
            }
            // convert a hex value to decimal
            function h2d(h) {
                return parseInt(h, 16);
            }

            var result = "#";
            for (var i = 1; i < 7; i += 2) {
                var color1Part = h2d(color1.substr(i, 2));
                var color2Part = h2d(color2.substr(i, 2));
                var resultPart = d2h(Math.floor(color2Part + (color1Part - color2Part) * (weight / 100.0)));
                result += ('0' + resultPart).slice(-2);
            }
            return result;
        }

        function tint(color, weight) {
            return mix('#ffffff', color, weight);
        };

        function shade(color, weight) {
            return mix('#000000', color, weight);
        };
        /* End */
        if (!isRendered) {
            isRendered = true;
            esClient.search(euiContentTypeQuery).then(function(resp) {
                _buildDonutChartData(resp.aggregations[2].buckets);
            }, function(err) {
                console.trace(err.message);
            });

            esClient.search(euiAccessQuery).then(function(resp) {
                _buildAreaData(resp.aggregations[2].buckets);
            }, function(err) {
                console.trace(err.message);
            });

            esClient.search(euiModificationsQuery).then(function(resp) {
                _buildBarChartData(resp.aggregations[2].buckets);
            }, function(err) {
                console.trace(err.message);
            });
        }

        function _buildBarChartData(data) {
            /* Bar chart */
            var layoutColors = {
                defaultText: '#333'
            };

            var dashboardColors = {
                surfieGreen: '#0e8174'
            };

            var dataProvider = [];

            for (var item in data) {
                dataProvider.push({
                    country: data[item].key_as_string.replace('00:00', '').trim(),
                    visits: data[item].doc_count,
                    color: dashboardColors.surfieGreen
                });

                if (dataProvider.length > 30) {
                    dataProvider.pop();
                }
            }

            var id = 'barChart';
            var barChart = AmCharts.makeChart(id, {
                type: 'serial',
                theme: 'blur',
                color: layoutColors.defaultText,
                dataProvider: dataProvider,
                valueAxes: [{
                    axisAlpha: 0.10,
                    position: 'left',
                    title: 'Number of Modifications',
                    gridAlpha: 0.5,
                    gridColor: 'transparent',
                }],
                startDuration: 1,
                graphs: [{
                    balloonText: '<b>[[category]]: [[value]]</b>',
                    fillColorsField: 'color',
                    fillAlphas: 0.7,
                    lineAlpha: 0.1,
                    type: 'column',
                    valueField: 'visits'
                }],
                chartCursor: {
                    categoryBalloonEnabled: false,
                    cursorAlpha: 0,
                    zoomable: false
                },
                categoryField: 'country',
                categoryAxis: {
                    title: 'Date',
                    gridPosition: 'start',
                    labelRotation: 0,
                    gridAlpha: 0.5,
                    axisAlpha: 0.10,
                    gridColor: 'transparent',
                },
                export: {
                    enabled: true
                },
                creditsPosition: 'top-right',
                pathToImages: 'assets/amCharts/'
            });
            /* End */
        }

        function _buildAreaData(data) {
            /* Area Chart */
            var dataProvider = [];
            for (var item in data) {
                dataProvider.push({
                    lineColor: 'orange',
                    date: data[item].key_as_string.replace('00:00', '').trim(),
                    duration: data[item].doc_count
                });

                if (dataProvider.length > 8) {
                    dataProvider.pop();
                }
            }

            var id = 'areaChart';
            var areaChart = AmCharts.makeChart(id, {
                type: 'serial',
                theme: 'blur',
                dataProvider: dataProvider,
                balloon: {
                    cornerRadius: 6,
                    horizontalPadding: 15,
                    verticalPadding: 10
                },
                valueAxes: [{
                    title: 'Access',
                    axisAlpha: 0.10,
                    gridAlpha: 0.1,
                    gridColor: 'transparent',
                }],
                graphs: [{
                    bullet: 'square',
                    fillAlphas: 0.5,
                    fillColorsField: 'lineColor',
                    legendValueText: '[[value]]',
                    lineColorField: 'lineColor',
                    title: 'duration',
                    valueField: 'duration'
                }],

                chartCursor: {
                    categoryBalloonDateFormat: 'YYYY MMM DD',
                    cursorAlpha: 0,
                    fullWidth: true
                },
                dataDateFormat: 'YYYY-MM-DD',
                categoryField: 'date',
                categoryAxis: {
                    title: 'Date',
                    axisAlpha: 0.10,
                    gridAlpha: 0.1,
                    autoGridCount: false,
                    gridCount: 50,
                    gridColor: 'transparent',
                },
                export: {
                    enabled: true
                },
                pathToImages: 'assets/amCharts/'
            });

            areaChart.addListener('dataUpdated', zoomAreaChart);

            function zoomAreaChart() {
                areaChart.zoomToDates(new Date(2012, 0, 3), new Date(2012, 0, 11));
            }
            /* End */
        }

        function _buildDonutChartData(data) {
            var transparent = false;
            var dashboardColors = ['#005562', '#0e8174', '#6eba8c', '#b9f2a1', '#10c4b5'];

            var doughnutData = [];
            var doughnutDataIndex = 0;
            for (var item in data) {
                var color = dashboardColors[doughnutDataIndex] || dashboardColors[0];
                doughnutData.push({
                    value: data[item].doc_count,
                    color: color,
                    highlight: shade(color, 15),
                    label: data[item].key,
                    percentage: 87,
                    order: doughnutDataIndex,
                });
                doughnutDataIndex++;
            }
            // Render Donut Chart
            _renderDonutChart(doughnutData);
        }

        function _renderDonutChart(doughnutData) {
            if (!document.getElementById('chart-area')) {
                setTimeout(function() {
                    _renderDonutChart(doughnutData);
                }, doughnutData, 500);
            } else {
                var ctx = document.getElementById('chart-area').getContext('2d');
                window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
                    segmentShowStroke: false,
                    percentageInnerCutout: 64,
                    responsive: true
                });
            }
        }
    }

})(angular.module('core.shared.controller', []));
