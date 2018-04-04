app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/cdps.html"
        })
        .when("/ui_health", {
            templateUrl: "templates/ui_health.html"
        })
        .when("/cdp_health", {
            templateUrl: "templates/cdp_health.html"
        })
})

app.factory('socket', function ($rootScope) {

    var socket = io.connect();
    return {
        on: function (eventName, callback) {            

            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });

            });

        },
        emit: function (eventName, data, callback) {

            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }

                });

            });

        }

    };

});

app.controller('MyCtrl', function ($scope, socket) {

    socket.emit('requestInit');

    socket.on('home', function (data) {
        $scope.events = data;
        events = data;
        $scope.eventSources = [$scope.events];
        data1 = JSON.stringify($scope.events);

    });

    // socket.on('add', function (data) {
    //      debugger;
    //     data1 = JSON.stringify(data);
    //     //alert('in add');
    //     $scope.events.push(data);

    // });

});
