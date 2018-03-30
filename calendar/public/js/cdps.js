app.controller('CDPCtrl', function ($scope, $location, $http) {
    var self = this;

    $scope.cardClick = function() {
        $location.path("/ui_health");
    }
    $scope.getCDP = function(){
        $http.get('/coc/cdps').then(function(res){
            debugger;
            $scope.cdps = res.data;
        })
    }
    $scope.getCDP();


    $scope.update = function () {

    }
    $scope.postCDP = function(newCDP){
        debugger;
        $http.post('/coc/cdps' ,newCDP).then(function(res){
            debugger;            
            toastr.success('New CDP ' + newCDP.cdp_details.title + ' added')
                 $scope.cdps.push(newCDP);
        $scope.$apply();  
        })
    }

    var addCDP = function (cdp) {
        var newCDP = {
            "cdp_id":cdp[0],
            "cdp_details":{
                "title": cdp[0],
                "desc": cdp[1],
                "ip": cdp[2],
                "version": "",
                "status": ""
            },
            "ui_details":""
        }
        debugger;
        $scope.postCDP(newCDP)         
    }

    $scope.showAddCDP = function () {

        swal.setDefaults({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3'],
            preConfirm: (cdp) => {
                if (!cdp) {
                    swal.showValidationError(
                        'Field is blank. Please enter valid input'
                    )
                }
            },
        })

        var steps = [
            'Enter CDP Name',
            'Enter CDP Description',
            'Enter CDP IP Address'
        ]

        swal.queue(steps).then((result) => {
            swal.resetDefaults()
            addCDP(result.value);
        })
    }
});

