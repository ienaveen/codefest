app.controller("UIAnalyticsCtrl", function(
	$scope,
	$location,
	$rootScope,
	$http,
	socket
) {
	var getBannerInfo = function() {
		$http.get("/coc/cdps/" + $rootScope.selectedCDPID).then(function(res) {
			$scope.cdp_data = res.data[0];
			$scope.cdp_banner_info = $scope.cdp_data.banner_info;
		});
	};

	getBannerInfo();

	socket.on("add", function(data) {
		$scope.cdp_banner_info = data.banner_info;
	});
});
