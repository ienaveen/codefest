app.controller("UIHealthCtrl", function ($scope, $location, $rootScope, $http, socket, $localStorage) {

	$scope.api = { "url": "", "username": "", "password": "" };
	$rootScope.selectedCDPID = $localStorage.selectedCDPID;
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

	$scope.showHome = function () {
		$location.path("/")
	}

	var getBannerInfo = function () {
		$http.get("/coc/cdps/" + $rootScope.selectedCDPID).then(function (res) {
			$scope.cdp_details = res.data[0].cdp_details;
		});
	};

	getBannerInfo();
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
		$scope.cdp_details_info = []
		var cdp_details_info = $scope.cdp_details.faulty_pods;
		var a = Object.keys(cdp_details_info)
		var obj;
		for (var i = 0; i < a.length; i++) {
			obj = {};
			obj.key = a[i];
			obj.y = cdp_details_info[a[i]]
			$scope.cdp_details_info.push(obj);
		}
	}

	var getBannerInfo = function () {
		$http.get("/coc/cdps/" + $localStorage.selectedCDPID).then(function (res) {
			var cdp_data = res.data[0];
			$scope.cdp_banner_info = cdp_data.ui_details.banner_info;
			getCDPDetailsInfo();
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
		if (data.cdp_id == $rootScope.selectedCDPID){
			$scope.apigw_res = data.ui_details.apigw_res;
			$scope.cdp_details = data.cdp_details;
			getCDPDetailsInfo();
		}
	});

	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}


	$scope.upgrade = function () {
		toastr.success("Upgrade started");
	}

	$scope.restart_pod = function () {
		toastr.success("Pods restarted");
	}

	$scope.download_snapshot = function () {
		toastr.success("Snapshot created");
	}

	$scope.trigger_plv = function () {
		toastr.success("PLV trigerred");
	}
});
