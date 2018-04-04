app.directive('card', function () {
	return {
		link: function (scope, element, attr) {

		},
		template: `
            <div class="card" ng-click="cardclick()">
                <div class="card-body">
                    <h4 class="card-title">{{cardobj.cdp_details.title}}</h4>
                    <p class="card-text">{{cardobj.cdp_details.desc}}</p>
                    <p class="card-text">{{cardobj.cdp_details.ip}}</p>
                    <p class="card-text">{{cardobj.cdp_details.version}}</p>
                    <p class="card-text">{{cardobj.cdp_details.status}}</p>
                </div>
            </div>
        `,
		scope: {
			cardobj: "=",
			cardclick: "&"
		},
		restrict: 'E'
	}
})
