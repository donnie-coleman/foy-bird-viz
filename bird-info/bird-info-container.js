(function(){
	angular
	.module('bird-info')
	.directive('birdInfoContainer', ['monthNameFilter', 'dayNameFilter', function(monthNameFilter, dayNameFilter) {
		return {
			replace: true,
	     	restrict: 'E',
			scope: {
				year: "=",
				initBird: "=initBird"
			},
			templateUrl: 'infocontainer.html',
			link: function (scope, element, attr){
			  scope.formatDate = function(bird){
			  		return bird ? dayNameFilter(bird.day)+", "+bird.date+" "+monthNameFilter(bird.month)+" "+bird.year : "";
			  };
		  	  scope.getLifer = function(bird){
			  		return bird && bird.lifer ? "Lifer":"";
			  };
	  	      scope.formatMonth = function(month){
	  		  	return monthNameFilter(month);
	  		  };
  	  		  scope.bird = _.findWhere(scope.year.birds, {bird:scope.initBird.bird});;

			  scope.$on('birdSelected', function(event, bird){
			     scope.bird = _.findWhere(scope.year.birds, {bird:bird.bird});
			     //scope.bird = scope.bird || scope.year.birds[0];
			  });
			}
		};
	}])
})();