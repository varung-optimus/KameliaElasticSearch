(function(app) {

	app.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$timeout'];

	function DashboardController($scope, $timeout) {
		var dashboard = this;

		dashboard.selectedRow = null; //intentionally we don't want things auto selected ;)
		dashboard.selectedObject = null;
		dashboard.selectedFilter = null;
		dashboard.filter1ToDate = moment().toDate();
		dashboard.filter1FromDate = moment().subtract(6,'days').toDate();
		dashboard.filter2ToDate = moment().toDate();
		dashboard.filter2FromDate = moment().subtract(6,'days').toDate();

		dashboard.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";
		$timeout(function() {
			dashboard.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";

			mermaid.init({
			 	startOnLoad:true,
                flowchart:{
                        useMaxWidth:false,
                        htmlLabels:true
                }
			}, ".graph-flowchart");
		}, dashboard, 1000);

		dashboard.redrawGraph = function() {
			angular.element(document.querySelector('#graph-flowchart'))
				.empty()
				.removeAttr('data-processed')
				.html(dashboard.lineage);

			// This has to be settimeout since we need to use jQuery here
			// not angular. The mermaid library needs jQuery to invoke this
			setTimeout(function() {
				mermaid.init({
				 	startOnLoad:true,
	                flowchart:{
	                        useMaxWidth:false,
	                        htmlLabels:true
	                }
				}, "#graph-flowchart");
			}, 100);
		};

		dashboard.filters = {
			0: 'Name',
			1: 'Path',
			2: 'Tag_Count',
			3: 'Size',
			4: 'Last_Modified'
		};

		dashboard.contentTypeFilters = [false, false, false, false];
		dashboard.sizeAccessedFilters = [false, false, false, false, false, false];
		dashboard.sizeModifiedFilters = [false, false, false, false, false, false];

		dashboard.hideOrClearFilter = function (action, type) {
			var arr = null;
			if (type == 'content')
				arr = dashboard.contentTypeFilters;
			else if (type == 'last_accessed')
				arr = dashboard.sizeAccessedFilters;
			else
				arr = dashboard.sizeModifiedFilters;

			if (action == 'clear') {
				for(var i=0;i<arr.length;i++)
					arr[i] = false
			} else {
				var chk = false;
				for(var i=0;i<arr.length;i++)
					if (arr[i]) {
						chk = arr[i] ;
						break;
					}
				return chk;
			}
		};

		dashboard.getDate = function (type) {
			var d = new Date();
			if (type == 'week')
				return d.getDay() == 0 ? 6: d.getDay();
			else if (type == 'month')
				return d.getDate()-1;
			else if (type == 'year')
				return d.getMonth() +1;
		};


		dashboard.selectTableRow = function (index) {
			dashboard.selectedRow = index;
		};

		dashboard.getPages = function () {
			var tmp = [];
			for(var i=1; i<= $scope.indexVM.pageCount; i++)
				tmp.push(i);
			return tmp;
		};

		dashboard.getFullDate = function (date) {
			if (date) {
				return moment(date).format('DD/MM/YYYY HH:mm');
			}else {
				return moment().format('DD/MM/YYYY HH:mm');
			}
		};

		$scope.$watch('indexVM.loading', function(newVal, oldVal) {
			if (newVal) {
				dashboard.selectedObject = null;
				dashboard.selectedRow = null;
			}
		});
	}

})(angular.module('core.dashboard.controller', []));
