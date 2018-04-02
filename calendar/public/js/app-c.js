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
    debugger;
    var socket = io.connect();
    return {
        on: function (eventName, callback) {

            socket.once(eventName, function () {
                debugger;
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
    debugger; 
    socket.emit('requestInit');

    socket.on('home', function (data) {
        debugger;
        $scope.events = data;
        events = data;
        $scope.eventSources = [$scope.events];
        data1 = JSON.stringify($scope.events);

    });

    socket.on('add', function (data) {
        debugger;
        data1 = JSON.stringify(data);
        //alert('in add');
        $scope.events.push(data);

    });

});