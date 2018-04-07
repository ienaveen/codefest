app.controller("CDPCtrl", function ($scope, $location, $http, $rootScope, socket, $localStorage) {
	var self = this;

	$scope.cardClick = function(cdp) {
		$localStorage.selectedCDPID = cdp.cdp_id;
		$rootScope.selectedCDPID = cdp.cdp_id;
		$location.path("/ui_health");
	};

	$scope.cdps = $localStorage.cdps;

	$scope.getCDP = function() {
		$http.get("/coc/cdps").then(function(res) {
			$scope.cdps = res.data;
			$localStorage.cdps = $scope.cdps;
		});
	};
	// socket.emit('requestInit');
	$scope.getCDP();

	socket.on("add", function(data) {
		//alert('in add');
        var exists = false,indx;
        for (var i =0;i<$scope.cdps.length;i++){
            if ($scope.cdps[i].cdp_id == data.cdp_id){
                exists = true;
                indx = i;
            }
        }
        if (exists)
            $scope.cdps[indx] = data
        else
		      $scope.cdps.push(data);
	});

	$scope.update = function() {};

	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-bottom-right",
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


	$scope.postCDP = function(newCDP) {
		$http.post("/coc/cdps", newCDP).then(function(res) {
			toastr.success("New CDP " + newCDP.cdp_details.title + " added");
			$scope.cdps.push(newCDP);
			$scope.$apply();
		});
	};

	var addCDP = function(cdp) {
		var newCDP = {
			cdp_id: cdp[0],
			cdp_details: {
				title: cdp[0],
				desc: cdp[1],
				ip: cdp[2],
				version: "",
				status: ""
			},
			ui_details: {}
		};
		$scope.postCDP(newCDP);
	};

	$scope.showAddCDP = function() {
		swal.setDefaults({
			input: "text",
			confirmButtonText: "Next &rarr;",
			showCancelButton: true,
			progressSteps: ["1", "2", "3"],
			preConfirm: cdp => {
				if (!cdp) {
					swal.showValidationError("Field is blank. Please enter valid input");
				}
			}
		});

		var steps = [
			"Enter CDP Name",
			"Enter CDP Description",
			"Enter CDP IP Address"
		];

		swal.queue(steps).then(result => {
			swal.resetDefaults();
			addCDP(result.value);
		});
	};
});

