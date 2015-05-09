(function(){
	angular
	.module('BirdApp', ['bird-service'])
	.controller('BirdsCtrl', ['$scope', 'birdService', '$q', function(scope, birdService, $q) {
	  scope.reverse = true;
	  scope.lifers = false;
	  scope.birdLists = [];

	  //populate the birdLists
	  //select the first bird in the latest list
	  $q.all(birdService.getBirds())
	    .then(function(datas){
	    	scope.birdLists = datas;
	    	var latestList = _.last(scope.birdLists).birds;
	    	scope.selectBird(scope.reverse ? _.last(latestList) : _.first(latestList));
	    });   

	  scope.selectBird = function(bird){
	  	scope.selected = typeof bird == 'string'? JSON.parse(bird):bird;
	  	//filters each bird list for use in bird info
	  	scope.selectedBirds = _.compact(_.map(scope.birdLists, function(birdList){
	  		return _.findWhere(birdList.birds, {bird:scope.selected.bird});
	  	}));
	  };
	}])
	.directive('birdList', ['monthNameFilter', function(monthNameFilter) {	
	  return {
		 replace: true,
	     restrict: 'E',
	     scope: {
	       year: '=',
		   birdName: '@',
		   reverse: '@',
		   lifers: '@',
		   select: '&' //invoke method on parent scope
	     },
	  	 templateUrl: 'allbirds.html',
	  	 link: function(scope,element, attr) {
	  	    scope.formatMonth = function(month){
	  			//console.log('formatMonth');
	  			return monthNameFilter(month);
	  		};
	  	 }
	   };
	}])
	.directive('birdInfoContainer', ['monthNameFilter', function(monthNameFilter) {	
		return {
			templateUrl: 'infocontainer.html',
			link: function (scope, element, attr){
			  scope.formatDate = function(bird){  	
			  		//console.log('formatDate');
			  		return bird ? monthNameFilter(bird.month)+" "+bird.date+", "+bird.year : "";
			  };
		  	  scope.getLifer = function(bird){
		  	  		//console.log('get lifer');
			  		return bird && bird.lifer ? "Lifer":"";
			  };
			}
		};
	}])
	.filter('monthName', function() {
	  return function(number) {
	  			//console.log('monthNameFilter');
			    return [ "January", "February", "March", 
					     "April", "May", "June", 
						 "July", "August", "September", 
					     "October", "November", "December"][number];
			  };
	})
	.filter('orderObjectBy', function(){
	 	return function(input) {
		    if (!angular.isObject(input)) return input;

		    var array = [];
		    for(var objectKey in input) {
		        array.push(input[objectKey]);
		    }
		    return array;
		 }
	})
	.filter('reverseOrder', function(){	
		return function(input, reverse){
			if((reverse === "true" || reverse === true) && input){
				return _.clone(input).reverse();
			}
			else {
				return input;
			}
		}
	});


	angular.element(document).ready(function() {
	  angular.bootstrap(document, ['BirdApp']);
	});
})();