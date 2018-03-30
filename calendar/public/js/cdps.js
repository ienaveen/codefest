app.controller('CDPCtrl', function ($scope, $location) {
    var self = this;

    $scope.cardClick = function() {
        $location.path("/ui_health");
    }

    $scope.cdps = [
        {
            "title": "CDP1",
            "desc": "CDP1 Description",
            "ip": "101.101.10.1",
            "version": "version",
            "status": "status"
        },
        {
            "title": "CDP2",
            "desc": "CDP2 Description",
            "ip": "101.101.10.2",
            "version": "version",
            "status": "status"
        },
        {
            "title": "CDP3",
            "desc": "CDP3 Description",
            "ip": "101.101.10.3",
            "version": "version",
            "status": "status"
        },
        {
            "title": "CDP4",
            "desc": "CDP4 Description",
            "ip": "101.101.10.4",
            "version": "version",
            "status": "status"
        }
    ]

    $scope.update = function () {

    }

    var addCDP = function (cdp) {
        var newCDP = {
            "title": cdp[0],
            "desc": cdp[1],
            "ip": cdp[2],
            "version": "version",
            "status": "status"
        }

        $scope.cdps.push(newCDP);
        $scope.$apply();
        toastr.success('New CDP ' + newCDP.title + ' added')
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

            /*
            var cdp = result.value;

            if (result.value) {
                swal({
                        title: 'Create CDP',
                        html:
                            'CDP Info' + "<pre>" +
                            JSON.stringify(result.value)
                            + "</pre>",
                        confirmButtonText: 'Submit'
                    }
                ).then((result) => {
                    debugger;
                });
            }
            */
        })
    }
});

