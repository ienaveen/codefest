app.directive('animatedHBarChart', function () {
	return {
		link: function (scope, element, attr) {
			datasetTotal = [
				{ label: "Category 1", value: 19 },
				{ label: "Category 2", value: 5 },
				{ label: "Category 3", value: 13 },
				{ label: "Category 4", value: 17 },
				{ label: "Category 5", value: 21 },
				{ label: "Category 6", value: 25 }
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

			d3.selectAll("input").on("change", selectDataset);

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
				width = 600 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;


			var div = d3.select("#animatedhbarchart").append("div").attr("class", "toolTip");

			var formatPercent = d3.format("");

			var y = d3.scale.ordinal()
				.rangeRoundBands([height, 0], .2, 0.5);

			var x = d3.scale.linear()
				.range([0, width]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.tickSize(-height)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
			//.tickFormat(formatPercent);

			var svg = d3.select("#animatedhbarchart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			d3.select("input[value=\"total\"]").property("checked", true);
			change(datasetTotal);

			function change(dataset) {

				y.domain(dataset.map(function (d) { return d.label; }));
				x.domain([0, d3.max(dataset, function (d) { return d.value; })]);

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
					.attr("transform", "rotate(0)")
					.attr("x", 50)
					.attr("dx", ".1em")
					.style("text-anchor", "end")
					.text("Option %");


				var bar = svg.selectAll(".bar")
					.data(dataset, function (d) { return d.label; });
				// new data:
				bar.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function (d) { return x(d.value); })
					.attr("y", function (d) { return y(d.label); })
					.attr("width", function (d) { return width - x(d.value); })
					.attr("height", y.rangeBand());

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
				bar.transition()
					.duration(750)
					.attr("x", function (d) { return 0; })
					.attr("y", function (d) { return y(d.label); })
					.attr("width", function (d) { return x(d.value); })
					.attr("height", y.rangeBand());

			};
		},
		template: `
			<div id="animatedhbarchart">
				<label><input type="radio" name="dataset" id="dataset" value="total" checked> Total</label>
				<label><input type="radio" name="dataset" id="dataset" value="option1"> Option 1</label>
				<label><input type="radio" name="dataset" id="dataset" value="option2"> Option 2</label>
			</div>
        `,
		scope: {
			cdpdata: "="
		},
		restrict: 'E'
	}
});
