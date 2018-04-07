app.directive('jsErrors', function () {
	return {
		link: function (scope, element, attr) {

			var margin = { top: 20, right: 50, bottom: 30, left: 50 },
				width = 500 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%d-%b-%y").parse,
				bisectDate = d3.bisector(function (d) { return d.timestamp; }).left,
				formatValue = d3.format(",.2f"),
				formatCurrency = function (d) { return "$" + formatValue(d); };

			var pageNames = {
				"NETWORKS": 1,
				"SYSTEM": 2,
				"DHCP": 3,
				"SERVICES": 4,
				"VPN": 5
			}

			var jserrordata = [
				{
					"timestamp": "1522932048",
					"message": "labels undefined",
					"user_name": "user1@gmail.com",
					"page_name": "SYSTEM"

				},
				{
					"timestamp": "1522932148",
					"message": "labels undefined",
					"user_name": "user2@gmail.com",
					"page_name": "NETWORKS"
				},
				{
					"timestamp": "1522932258",
					"message": "labels undefined",
					"user_name": "user3@gmail.com",
					"page_name": "SERVICES"
				}
			];

			jserrordata.forEach(function (arrVal) {
				arrVal.page_name_id = pageNames[arrVal.page_name];
			})

			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			var line = d3.svg.line()
				.x(function (d) { return x(d.timestamp); })
				.y(function (d) { return y(d.page_name_id); });

			var svg = d3.select("#jserrorschart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			d3.tsv("data.tsv", function (error, data1) {

				scope.$watch("jserrordata", function (newData, oldData) {

					if (!newData || oldData && (newData !== oldData)) {
						return;
					}

					var data = newData;

					data.forEach(function (d) {
						d.page_name_id = pageNames[d.page_name]
						d.timestamp = +d.timestamp;
					});

					data.sort(function (a, b) {
						return a.timestamp - b.timestamp;
					});

					x.domain([data[0].timestamp, data[data.length - 1].timestamp]);
					y.domain(d3.extent(data, function (d) { return d.page_name_id; }));

					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("PAGES");

					svg.append("path")
						.datum(data)
						.attr("class", "line")
						.attr("d", line);

					var focus = svg.append("g")
						.attr("class", "focus")
						.style("display", "none");

					focus.append("circle")
						.attr("r", 4.5);

					focus.append("text")
						.attr("x", 9)
						.attr("dy", ".35em");

					svg.append("rect")
						.attr("class", "overlay")
						.attr("width", width)
						.attr("height", height)
						.on("mouseover", function () { focus.style("display", null); })
						.on("mouseout", function () { focus.style("display", "none"); })
						.on("mousemove", mousemove)
						.on("click", click)

					function mousemove() {
						var data = scope.jserrordata;
						var x0 = x.invert(d3.mouse(this)[0]),
							i = bisectDate(data, x0, 1),
							d0 = data[i - 1],
							d1 = data[i],
							d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
						focus.attr("transform", "translate(" + x(d.timestamp) + "," + y(d.page_name_id) + ")");
						focus.select("#jserrorschart text").text(d.page_name + ": " + d.message);
					}

					function click() {
						var data = scope.jserrordata;
						var x0 = x.invert(d3.mouse(this)[0]),
							i = bisectDate(data, x0, 1),
							d0 = data[i - 1],
							d1 = data[i],
							d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;


						swal({
							title: 'Error - ' + d.message,
							html: 'Found by user <b>' + d.user_name + '</b> in page <b>' + d.page_name + "</b><br>You want to create a jira ticket for this",
							type: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes, Create the Jira Issue!'
						}).then((result) => {
							if (result.value) {
								swal(
									'Created!',
									'Jira ticket 78965 is created',
									'success'
								)
							}
						});
						// alert("create bug for " + d.message );
					}
				});


			});

		},
		template: `
			<div id="jserrorschart">
				<h1 class="chart-title">JS Exceptions Chart</h1>
			</div>
        `,
		scope: {
			jserrordata: "="
		},
		restrict: 'E'
	}
});
