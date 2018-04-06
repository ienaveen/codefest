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


			var apierrors = [
				{
					"page_name": "DHCP",
					"page_name_id": "1",
					"api_errors": [
						{
							"api": "/config/system",
							"count": 4,
							"status_code": 509
						}
					]
				},
				{
					"page_name": "NETWORKS",
					"page_name_id": "2",
					"api_errors": [
						{
							"api": "/config/system",
							"count": 6,
							"status_code": 509
						},
						{
							"api": "NETWORKS/config2",
							"count": 1,
							"status_code": "504 Gateway Timeout"
						},
						{
							"api": "NETWORKS/v1/getnetwork",
							"count": 4,
							"status_code": "404 Not Found"
						},
						{
							"api": "NETWORKS/v1/getnetwork2",
							"count": 4,
							"status_code": "404 Not Found"
						},
						{
							"api": "NETWORKS/v1/getnetwork",
							"count": 4,
							"status_code": "404 Not Found"
						},
						{
							"api": "NETWORKS/v1/getnetwork2",
							"count": 4,
							"status_code": "404 Not Found"
						},
						{
							"api": "NETWORKS/v1/getnetwork",
							"count": 4,
							"status_code": "404 Not Found"
						},
						{
							"api": "NETWORKS/v1/getnetwork2",
							"count": 4,
							"status_code": "404 Not Found"
						}
					]
				},
				{
					"page_name": "SERVICES",
					"page_name_id": "3",
					"api_errors": [
						{
							"api": "/config/system",
							"count": 4,
							"status_code": 509
						},
						{
							"api": "NETWORKS/config2",
							"count": 1,
							"status_code": "504 Gateway Timeout"
						},
						{
							"api": "NETWORKS/v1/getnetwork",
							"count": 4,
							"status_code": "404 Not Found"
						}
					]
				},
				{
					"page_name": "SYSTEM",
					"page_name_id": "4",
					"api_errors": [
						{
							"api": "/config/system",
							"count": 4,
							"status_code": 509
						}
					]
				},
				{
					"page_name": "VPN",
					"page_name_id": "5",
					"api_errors": [
						{
							"api": "/config/system",
							"count": 4,
							"status_code": 509
						},
						{
							"api": "NETWORKS/config2",
							"count": 1,
							"status_code": "504 Gateway Timeout"
						},
						{
							"api": "NETWORKS/v1/getnetwork",
							"count": 4,
							"status_code": "404 Not Found"
						}
					]
				}
			]

			d3.tsv("crimea.tsv", function (error, crimea) {
				// if (error) throw error;
				debugger;
				// var crimea = apierrors;

				var newdata = [];

				var maxApiLength = d3.max(apierrors, function (d) { return d.api_errors.length; });

				for (var aIdx = 0; aIdx < maxApiLength; aIdx++) {
					newdata.push([]);

					apierrors.forEach(function (d, dIndex) {
						newdata[aIdx].push({
							"x": +d.page_name_id,
							"y": d.api_errors[aIdx] ? d.api_errors[aIdx].count : 0,
							"api": d.api_errors[aIdx] ? d.api_errors[aIdx].api : "",
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

				svg.append("g")
					.attr("class", "axis axis--y")
					.attr("transform", "translate(" + width + ",0)")
					.call(yAxis);

				rect.on("mousemove", function (d) {
					var desc = d3.select("#apierrorschart #apidesc");
					var element = this.__data__;
					value = element.y1 - element.y0;
					desc.html("<b>API</b>: " + (d.api) + "<br>" + "<b>Count</b>: " + d.count);
				});

				rect.on("mouseout", function (d) {
					// divTooltip.style("display", "none");
				});

			});

		},
		template: `
			<div id="apierrorschart">
				<div id="apidesc"></div>
			</div>
        `,
		scope: {
			apierrors: "="
		},
		restrict: 'E'
	}
});
