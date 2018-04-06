app.directive('apiTimeoutChart', function () {
	return {
		link: function (scope, element, attr) {

			var colors = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"];

			var updatecolors = function(arr) {
				arr.forEach(function(item, index){
					item['color'] = colors[index];
				});

				return arr;
			}

			scope.$watch("apitimeout", function (newData, oldData) {
				debugger;
				newData = updatecolors(newData)
				Donut3D.draw("timeoutdonut", newData, 150, 150, 130, 100, 30, 0.4);
				// Donut3D.transition("timeoutdonut", newData, 130, 100, 30, 0.4);
			});

			var svg = d3.select("#apitimeoutchart").append("svg").attr("width", 700).attr("height", 300);

			svg.append("g").attr("id", "timeoutdonut");

		},
		template: `
            <div id="apitimeoutchart"></div>
        `,
		scope: {
			apitimeout: "="
		},
		restrict: 'E'
	}
});
