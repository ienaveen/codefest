app.controller("UIHealthCtrl", function (
	$scope,
	$location,
	$rootScope,
	$http,
	socket,
	$localStorage
) {

	$scope.api = { "url": "", "username": "", "password": "" };
	$scope.tracebacks = [
		{
			"count": 1,
			"pod": "admin-celery-workers-deployment-698754206-n90zc",
			"kubernetes-version": "2.4.1-193.P",
			"error_message": "[ERROR] [ 100] [-:-] roles_helper.py:345 'Error while creating user acp.nrupen+malshi@gmail.com for end customer 30005086. Reason: '"
		},
		{
			"count": 2,
			"pod": "admin-celery-workers-deployment-698754206-n90zcacp-context-engine-ng-deployment-1836004932-8g5kt",
			"kubernetes-version": "3.9.0-62",
			"error_message": "UTC [vert.x-eventloop-thread-1] [ERROR] c.a.a.c.w.http.DeviceConnection - Exception writing topic: device.connection.disconnect to output stream for serial:AX0140586 java.lang.IllegalStateException: WebSocket is closed at io.vertx.core.http.impl.WebSocketImplBase.checkClosed(WebSocketImplBase.java:157) "
		},
		{
			"count": 1,
			"pod": "monitoring-celery-workers-deployment-m-743685811-66fz7",
			"kubernetes-version": "2.4.1-208.P",
			"error_message": "[ERROR] [10305] [-:-] hp_stack_stats.py:77 'Not able to find a stack member. CID: 30023522 device_id: HKKF000041 member_id: 2'"
		}
	];
	$scope.options = {
		chart: {
			type: 'pieChart',
			height: 600,
			width: 900,
			donut: true,
			x: function (d) { return d.key; },
			y: function (d) { return d.y; },
			showLabels: true,

			pie: {
				startAngle: function (d) { return d.startAngle / 2 - Math.PI / 2 },
				endAngle: function (d) { return d.endAngle / 2 - Math.PI / 2 }
			},
			duration: 500,
			legend: {
				margin: {
					top: 50,
					right: 70,
					bottom: 50,
					left: 0
				}
			}
		}
	};

	var getCDPDetailsInfo = function () {
		$scope.cdp_details_info = [
			{
				key: "ofc",
				y: 5
			},
			{
				key: "ucc-se-flow-mgr",
				y: 2
			},
			{
				key: "frontend-controller",
				y: 9
			},
			{
				key: "kong-controller",
				y: 7
			},
			{
				key: "nginx-controller",
				y: 4
			}
		];
	}

	getCDPDetailsInfo();
	var getBannerInfo = function () {
		$http.get("/coc/cdps/" + $localStorage.selectedCDPID).then(function (res) {
			var cdp_data = res.data[0];
			$scope.cdp_banner_info = cdp_data.ui_details.banner_info;
		});
	};

	$scope.submit_api_form = function (data) {
		$scope.postAPIGW(data)

	}
	$scope.postAPIGW = function (newCDP) {
		$http.post("/coc/apigw", newCDP).then(function (res) {
			//$scope.cdps.push(newCDP);
			//$scope.$apply();
		});
	};
	getBannerInfo();

	socket.on("add", function (data) {
		$scope.apigw_res = data.ui_details.apigw_res;
	});
});
