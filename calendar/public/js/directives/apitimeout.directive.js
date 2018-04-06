app.directive('apiTimeoutChart', function () {
	return {
		link: function (scope, element, attr) {

			var colors = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"];

			var updatecolors = function(arr) {
				arr.forEach(function(item, index){
					item['color'] = colors[index];
					item['value'] = item['time'];
				});

				return arr;
			}

			scope.$watch("apitimeout", function (newData, oldData) {
				newData = updatecolors(newData)
				if(!oldData){
					Donut3D.draw("timeoutdonut", scope.apitimeout, 150, 150, 130, 100, 30, 0.4);
				}else{
					Donut3D.transition("timeoutdonut", newData, 130, 100, 30, 0.4);
				}
			});

			var svg = d3.select("#apitimeoutchart").append("svg").attr("width", 400).attr("height", 300);

			svg.append("g").attr("id", "timeoutdonut");

			var path = d3.selectAll("#apitimeoutchart #timeoutsummary");

		},
		template: `
			<div id="apitimeoutchart">
				<h1 class="chart-title">API Timeout chart</h1>
				<div id="timeoutsummary"></div>
			</div>
        `,
		scope: {
			apitimeout: "="
		},
		restrict: 'E'
	}
});
