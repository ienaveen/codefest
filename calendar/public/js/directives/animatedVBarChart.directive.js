app.directive('animatedVBarChart', function () {
	return {
		link: function (scope, element, attr) {
			d3.select("#animatedvbarchart input[value=\"total\"]").property("checked", true);

			datasetTotal = [
				{ label: "AirGroup", value: 19 },
				{ label: "UCC", value: 5 },
				{ label: "NMS", value: 27 },
				{ label: "Clarity", value: 13 },
				{ label: "Clickstream", value: 17 },
				{ label: "PA", value: 19 }
			];

			datasetOption1 = [
				{ label: "Category 1", value: 22 },
				{ label: "Category 2", value: 33 },
				{ label: "Category 3", value: 4 },
				{ label: "Category 4", value: 15 },
				{ label: "Category 5", value: 36 },
				{ label: "Category 6", value: 0 }
			];

			datasetOption2 = [
				{ label: "Category 1", value: 10 },
				{ label: "Category 2", value: 20 },
				{ label: "Category 3", value: 30 },
				{ label: "Category 4", value: 5 },
				{ label: "Category 5", value: 12 },
				{ label: "Category 6", value: 23 }
			];

			d3.selectAll("#animatedvbarchart input").on("change", selectDataset);

			function selectDataset() {
				var value = this.value;
				if (value == "total") {
					change(datasetTotal);
				}
				else if (value == "option1") {
					change(datasetOption1);
				}
				else if (value == "option2") {
					change(datasetOption2);
				}
			}

			var margin = { top: 0, right: 0, bottom: 0, left: 0 },
				width = 300 - margin.left - margin.right,
				height = 300 - margin.top - margin.bottom;

			var div = d3.select("#animatedvbarchart").append("div").attr("class", "toolTip");

			var formatPercent = d3.format("");

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .2, 0.5);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(formatPercent);

			var svg = d3.select("#animatedvbarchart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			change(datasetTotal);

			function change(dataset) {

				x.domain(dataset.map(function (d) { return d.label; }));
				y.domain([0, d3.max(dataset, function (d) { return d.value; })]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				svg.select(".y.axis").remove();
				svg.select(".x.axis").remove();

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("No. of visited users");

				var bar = svg.selectAll(".bar")
					.data(dataset, function (d) { return d.label; });
				// new data:
				bar.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function (d) { return x(d.label); })
					.attr("y", function (d) { return y(d.value); })
					.attr("height", function (d) { return height - y(d.value); })
					.attr("width", x.rangeBand());

				bar
					.on("mousemove", function (d) {
						div.style("left", d3.event.pageX + 10 + "px");
						div.style("top", d3.event.pageY - 25 + "px");
						div.style("display", "inline-block");
						div.html((d.label) + "<br>" + (d.value) + "%");
					});
				bar
					.on("mouseout", function (d) {
						div.style("display", "none");
					});

				// removed data:
				bar.exit().remove();
				// updated data:
				bar
					.transition()
					.duration(750)
					.attr("y", function (d) { return y(d.value); })
					.attr("height", function (d) { return height - y(d.value); });
			};
		},
		template: `
			<div id="animatedvbarchart">
				<h1 class="chart-title">Visited users per app</h1>
			</div>
        `,
		scope: {
			cdpdata: "="
		},
		restrict: 'E'
	}
});
