app.directive('apiErrorChart', function () {
	return {
		link: function (scope, element, attr) {

			var margin = { top: 20, right: 50, bottom: 30, left: 20 },
				width = 600 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width]);

			var y = d3.scale.linear()
				.rangeRound([height, 0]);

			var z = d3.scale.category10();

			var pages = ["DHCP", "NETWORKS", "SERVICES", "SYSTEM", "VPN"];

			var pageNames = {
				"NETWORKS": 1,
				"SYSTEM": 2,
				"DHCP": 3,
				"SERVICES": 4,
				"VPN": 5
			}


			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("right");

			var svg = d3.select("#apierrorschart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var divTooltip = d3.select("#apierrorschart").append("div").attr("class", "toolTip");

			d3.tsv("crimea.tsv", function (error, crimea) {

				scope.$watch("apierrors", function (newData, oldData) {

					if(!newData){
						return;
					}

					var newdata = [];
					var apierrors = newData;

					apierrors.forEach(function (d) {
						d.page_name_id = pageNames[d.page_name]
					});

					var maxApiLength = d3.max(apierrors, function (d) { return d.api_errors.length; });

					for (var aIdx = 0; aIdx < maxApiLength; aIdx++) {
						newdata.push([]);

						apierrors.forEach(function (d, dIndex) {
							newdata[aIdx].push({
								"x": +d.page_name_id,
								"y": d.api_errors[aIdx] ? d.api_errors[aIdx].count : 0,
								"url": d.api_errors[aIdx] ? d.api_errors[aIdx].url : "",
								"count": d.api_errors[aIdx] ? d.api_errors[aIdx].count : ""
							});
						});
					}

					var layers = d3.layout.stack()(newdata);

					x.domain(layers[0].map(function (d) { return d.x; }));
					y.domain([0, d3.max(layers[layers.length - 1], function (d) { return d.y0 + d.y; })]).nice();

					var layer = svg.selectAll("#apierrorschart .layer")
						.data(layers)
						.enter().append("g")
						.attr("class", "layer")
						.style("fill", function (d, i) { return z(i); });

					var rect = layer.selectAll("#apierrorschart rect")
						.data(function (d) { return d; })
						.enter().append("rect")
						.attr("class", "bar")
						.attr("x", function (d) { return x(d.x); })
						.attr("y", function (d) { return y(d.y + d.y0); })
						.attr("height", function (d) { return y(d.y0) - y(d.y + d.y0); })
						.attr("width", x.rangeBand() - 40);

					svg.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					// svg.append("g")
					// 	.attr("class", "axis axis--y")
					// 	.attr("transform", "translate(" + width + ",0)")
					// 	.call(yAxis);

					rect.on("mousemove", function (d) {
						var desc = d3.select("#apierrorschart #apidesc");
						var element = this.__data__;
						value = element.y1 - element.y0;
						desc.html("<b>API</b>: " + (d.url) + "<br>" + "<b>Count</b>: " + d.count);
					});

					rect.on("mouseout", function (d) {
						var desc = d3.select("#apierrorschart #apidesc");
						desc.html("");
					});
				});
			});

		},
		template: `
			<div id="apierrorschart">
				<h1 class="chart-title">API Error Chart</h1>
				<div id="apidesc"></div>
			</div>
        `,
		scope: {
			apierrors: "="
		},
		restrict: 'E'
	}
});
