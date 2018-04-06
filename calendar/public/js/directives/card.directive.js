app.directive('card', function () {
	return {
		link: function (scope, element, attr) {

		},
		template: `
			<div class="card" ng-click="cardclick()">
				<button type="button" class="close" aria-label="Close" ng-click="clickclose()">
					<span aria-hidden="true">&times;</span>
				</button>
                <div class="card-body">                
                    <center><h4 class="card-title">{{cardobj.cdp_details.title}}</h4></center>
                    <center><p class="card-text">{{cardobj.cdp_details.desc}}</p></center>
                    <ul>
                       <li>
                       		<span class="card-label">Host:</span>		
                    		<span class="card-text">{{cardobj.cdp_details.ip}}</span>
                      <li>
                      <li>
                      		<span class="card-label">Version:</span>		
                    		<span class="card-text">{{cardobj.cdp_details.version}}</span>
                    </li>
                    <li>
                    	<span class="card-label">Status:</span>
                    	<span class="card-text" ng-class="{'color-red':cardobj.cdp_details.status == 'Unstable','color-green':cardobj.cdp_details.status == 'Stable','color-blue':cardobj.cdp_details.status == 'Upgrading','color-orange':cardobj.cdp_details.status == 'Partial-Stable'}">{{cardobj.cdp_details.status}}</span>
                    </li>
                    <li>
                    	<span class="card-label">Channel:</span>
                    	<span class="card-text">{{cardobj.cdp_details.channel_name}}</span>
                    </li>
                </div>
            </div>
        `,
		scope: {
			cardobj: "=",
			cardclick: "&",
			clickclose: "&"
		},
		restrict: 'E'
	}
})
