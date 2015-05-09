(function(){
	angular
	.module('bird-info')
	.directive('birdInfoContainerContainer', ['$rootScope', function($rootScope) {
		return {
			link: function(scope, elem, attr){
				scope.open = false;
			}
		};
	}]);
})();