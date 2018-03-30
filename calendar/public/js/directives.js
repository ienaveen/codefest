app.directive('card', function () {
    return {
        link: function (scope, element, attr) {

        },
        template: `
            <div class="card" ng-click="cardclick()">
                <div class="card-body">
                    <h4 class="card-title">{{cardobj.cdp_details.title}}</h4>
                    <p class="card-text">{{cardobj.cdp_details.desc}}</p>
                    <p class="card-text">{{cardobj.cdp_details.ip}}</p>
                    <p class="card-text">{{cardobj.cdp_details.version}}</p>
                    <p class="card-text">{{cardobj.cdp_details.status}}</p>
                </div>
            </div>
        `,
        scope: {
            cardobj: "=",
            cardclick: "&"
        },
        restrict: 'E'
    }
})


app.directive('liveBarChart', function () {
    return {
        link: function (scope, element, attr) {
            //updatingBarChart.js

            var setup = function (targetID) {
                //Set size of svg element and chart
                var margin = { top: 0, right: 0, bottom: 0, left: 0 },
                    width = 600 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom,
                    categoryIndent = 4 * 15 + 5,
                    defaultBarWidth = 2000;

                //Set up scales
                var x = d3.scale.linear()
                    .domain([0, defaultBarWidth])
                    .range([0, width]);
                var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], 0.1, 0);

                //Create SVG element
                d3.select(targetID).selectAll("svg").remove()
                var svg = d3.select(targetID).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //Package and export settings
                var settings = {
                    margin: margin, width: width, height: height, categoryIndent: categoryIndent,
                    svg: svg, x: x, y: y
                }
                return settings;
            }

            var redrawChart = function (targetID, newdata) {

                //Import settings
                var margin = settings.margin, width = settings.width, height = settings.height, categoryIndent = settings.categoryIndent,
                    svg = settings.svg, x = settings.x, y = settings.y;

                //Reset domains
                y.domain(newdata.sort(function (a, b) {
                    return b.value - a.value;
                })
                    .map(function (d) { return d.key; }));
                var barmax = d3.max(newdata, function (e) {
                    return e.value;
                });
                x.domain([0, barmax]);

                /////////
                //ENTER//
                /////////

                //Bind new data to chart rows 

                //Create chart row and move to below the bottom of the chart
                var chartRow = svg.selectAll("g.chartRow")
                    .data(newdata, function (d) { return d.key });
                var newRow = chartRow
                    .enter()
                    .append("g")
                    .attr("class", "chartRow")
                    .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

                //Add rectangles
                newRow.insert("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("opacity", 0)
                    .attr("height", y.rangeBand())
                    .attr("width", function (d) { return x(d.value); })

                //Add value labels
                newRow.append("text")
                    .attr("class", "label")
                    .attr("y", y.rangeBand() / 2)
                    .attr("x", 0)
                    .attr("opacity", 0)
                    .attr("dy", ".35em")
                    .attr("dx", "0.5em")
                    .text(function (d) { return d.value; });

                //Add Headlines
                newRow.append("text")
                    .attr("class", "category")
                    .attr("text-overflow", "ellipsis")
                    .attr("y", y.rangeBand() / 2)
                    .attr("x", categoryIndent)
                    .attr("opacity", 0)
                    .attr("dy", ".35em")
                    .attr("dx", "0.5em")
                    .text(function (d) { return d.key });


                //////////
                //UPDATE//
                //////////

                //Update bar widths
                chartRow.select(".bar").transition()
                    .duration(300)
                    .attr("width", function (d) { return x(d.value); })
                    .attr("opacity", 1);

                //Update data labels
                chartRow.select(".label").transition()
                    .duration(300)
                    .attr("opacity", 1)
                    .tween("text", function (d) {
                        var i = d3.interpolate(+this.textContent.replace(/\,/g, ''), +d.value);
                        return function (t) {
                            this.textContent = Math.round(i(t));
                        };
                    });

                //Fade in categories
                chartRow.select(".category").transition()
                    .duration(300)
                    .attr("opacity", 1);


                ////////
                //EXIT//
                ////////

                //Fade out and remove exit elements
                chartRow.exit().transition()
                    .style("opacity", "0")
                    .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
                    .remove();


                ////////////////
                //REORDER ROWS//
                ////////////////

                var delay = function (d, i) { return 200 + i * 30; };

                chartRow.transition()
                    .delay(delay)
                    .duration(900)
                    .attr("transform", function (d) { return "translate(0," + y(d.key) + ")"; });
            };



            //Pulls data
            //Since our data is fake, adds some random changes to simulate a data stream.
            //Uses a callback because d3.json loading is asynchronous
            var pullData = function (settings, callback) {
                d3.json("fakeData.json", function (err, data) {
                    if (err) return console.warn(err);

                    var newData = data;
                    data.forEach(function (d, i) {
                        var newValue = d.value + Math.floor((Math.random() * 10) - 5)
                        newData[i].value = newValue <= 0 ? 10 : newValue
                    })

                    newData = formatData(newData);

                    callback(settings, newData);
                })
            }

            //Sort data in descending order and take the top 10 values
            var formatData = function (data) {
                return data.sort(function (a, b) {
                    return b.value - a.value;
                })
                    .slice(0, 10);
            }

            //I like to call it what it does
            var redraw = function (settings) {
                pullData(settings, redrawChart)
            }

            //setup (includes first draw)
            var settings = setup("#" + element[0].childNodes[1].id);
            redraw(settings)

            //Repeat every 3 seconds
            setInterval(function () {
                redraw(settings)
            }, 3000);
        },
        template: `
            <div id="livebarchart"></div>
        `,
        restrict: 'E'
    }
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

app.directive('lineChart', function () {
    return {
        link: function (scope, element, attr) {

            var m = [20, 20, 30, 20],
                w = 960 - m[1] - m[3],
                h = 500 - m[0] - m[2];

            var x,
                y,
                duration = 1500,
                delay = 500;

            var color = d3.scale.category10();

            var svg = d3.select("#" + element[0].childNodes[1].id).append("svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            var stocks,
                symbols;

            // A line generator, for the dark stroke.
            var line = d3.svg.line()
                .interpolate("basis")
                .x(function (d) { return x(d.date); })
                .y(function (d) { return y(d.price); });

            // A line generator, for the dark stroke.
            var axis = d3.svg.line()
                .interpolate("basis")
                .x(function (d) { return x(d.date); })
                .y(h);

            // A area generator, for the dark stroke.
            var area = d3.svg.area()
                .interpolate("basis")
                .x(function (d) { return x(d.date); })
                .y1(function (d) { return y(d.price); });

            d3.csv("stocks.csv", function (data) {
                var parse = d3.time.format("%b %Y").parse;

                // Nest stock values by symbol.
                symbols = d3.nest()
                    .key(function (d) { return d.symbol; })
                    .entries(stocks = data);

                // Parse dates and numbers. We assume values are sorted by date.
                // Also compute the maximum price per symbol, needed for the y-domain.
                symbols.forEach(function (s) {
                    s.values.forEach(function (d) { d.date = parse(d.date); d.price = +d.price; });
                    s.maxPrice = d3.max(s.values, function (d) { return d.price; });
                    s.sumPrice = d3.sum(s.values, function (d) { return d.price; });
                });

                // Sort by maximum price, descending.
                symbols.sort(function (a, b) { return b.maxPrice - a.maxPrice; });

                var g = svg.selectAll("g")
                    .data(symbols)
                    .enter().append("g")
                    .attr("class", "symbol");

                setTimeout(lines, 500);
            });

            function lines() {
                x = d3.time.scale().range([0, w - 60]);
                y = d3.scale.linear().range([h / 4 - 20, 0]);

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(symbols, function (d) { return d.values[0].date; }),
                    d3.max(symbols, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                var g = svg.selectAll(".symbol")
                    .attr("transform", function (d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

                g.each(function (d) {
                    var e = d3.select(this);

                    e.append("path")
                        .attr("class", "line");

                    e.append("circle")
                        .attr("r", 5)
                        .style("fill", function (d) { return color(d.key); })
                        .style("stroke", "#000")
                        .style("stroke-width", "2px");

                    e.append("text")
                        .attr("x", 12)
                        .attr("dy", ".31em")
                        .text(d.key);
                });

                function draw(k) {
                    g.each(function (d) {
                        var e = d3.select(this);
                        y.domain([0, d.maxPrice]);

                        e.select("path")
                            .attr("d", function (d) { return line(d.values.slice(0, k + 1)); });

                        e.selectAll("circle, text")
                            .data(function (d) { return [d.values[k], d.values[k]]; })
                            .attr("transform", function (d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
                    });
                }

                var k = 1, n = symbols[0].values.length;
                d3.timer(function () {
                    draw(k);
                    if ((k += 2) >= n - 1) {
                        draw(n - 1);
                        return true;
                    }
                });
            }

        },
        template: `
            <div id="linechart"></div>
        `,
        restrict: 'E'
    }
});