app.controller("UIHealthCtrl", function(
	$scope,
	$location,
	$rootScope,
	$http,
	socket
) {

	$scope.api = {"url": "", "username": "", "password": ""};

	var getBannerInfo = function() {
		$http.get("/coc/cdps/" + $rootScope.selectedCDPID).then(function(res) {
			var cdp_data = res.data[0];
			$scope.cdp_banner_info = cdp_data.banner_info;
		});
	};

	$scope.submit_api_form = function(data){

	}
	getBannerInfo();

	socket.on("add", function(data) {
		$scope.cdp_banner_info = data.banner_info;
	});
});
