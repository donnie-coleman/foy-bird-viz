(function(){
	angular
	.module('bird-list')
	.directive('birdList', ['monthNameFilter', function(monthNameFilter) {	
	  return {
		 replace: true,
	     restrict: 'E',
	     scope: {
	       year: '=',
		   birdName: '@',
		   reverse: '@',
		   lifers: '@',
		   drawerState: '=',
		   select: '&', //invoke method on parent scope
		   refresh: '&'
	     },
	  	 templateUrl: 'allbirds.html',
	  	 link: function(scope,element, attr) {
	  	    scope.formatMonth = function(month){
	  			//console.log('formatMonth');
	  			return monthNameFilter(month);
	  		};
	  	 }
	   };
	}]);
})();