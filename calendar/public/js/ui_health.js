app.controller("UIHealthCtrl", function(
	$scope,
	$location,
	$rootScope,
	$http,
	socket
) {

	$scope.api = {"url": "", "username": "", "password": ""};

    $scope.options = {
            chart: {
                type: 'pieChart',
                height: 600,
                width: 900, 
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
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

    var getCDPDetailsInfo = function(){
        // $http.get("/coc/cdps/" + $rootScope.selectedCDPID).then(function(res) {
        //     var cdp_data = res.data[0];
        //     $scope.cdp_banner_info = cdp_data.banner_info;
        // });
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
