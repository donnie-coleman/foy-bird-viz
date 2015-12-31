(function(){
	angular
	.module('BirdApp', ['bird-service', 'bird-list', 'utils', 'bird-info','bird-suggestion'])
	.controller('BirdsCtrl', ['$scope', 'birdService', '$q', '$filter', function(scope, birdService, $q, $filter) {
		scope.reverse = true;
		scope.lifers = false;
		scope.birdLists = [];
		scope.drawerState = false;
		scope.initBird = "";
		scope.currentBird = "";
		scope.suggestedBird = "";
		scope.suggestedBirds = [];
		scope.currentSuggestion = -1;

    //populate the birdLists
    //select the first bird in the latest list
    $q.all(birdService.getBirds())
      .then(function (datas) {
        if (!datas.length) return;
        scope.birdLists = datas;
        var latestList = _.last(scope.birdLists).birds;
        scope.initBird = scope.selectBird(scope.reverse ? _.last(latestList) : _.first(latestList), true);
        scope.suggestedBirds = createSuggestions(scope.birdLists);
        scope.getNextSuggestion();
      });

    var createSuggestions = function (data) {
      return _.flatten(data.map(function (list) {
        return _.filter(list.birds, function (bird) {
          return bird.withinComparisonWindow;
        });
      })).reverse();
    };

    scope.getNextSuggestion = function (down) {
      if(down) {
        scope.currentSuggestion--;
      } else {
        scope.currentSuggestion++;
      }

      //scope.suggestedBird = _.sample(_.sample(scope.birdLists).birds); // random bird

      var reverse = scope.currentSuggestion < 0 ? scope.suggestedBirds.length : 0;
      scope.suggestedBird = scope.suggestedBirds[(scope.currentSuggestion % scope.suggestedBirds.length) + reverse];
    };

		scope.refreshList = function (list) {
			var year = list.year;
			birdService.getBirdsByYear(year)
			.then(function(data){
				var index = _.findIndex(scope.birdLists, {year:year});
				scope.birdLists[index] = data;
				scope.initBird = scope.currentBird;
			});
		};

		scope.selectBird = function(bird, doNotToggleDrawer){
			if(scope.showGraph) return null;
			var selected = typeof bird == 'string'? JSON.parse(bird):bird;

			scope.$broadcast('birdSelected', selected);
			if(!doNotToggleDrawer && !scope.drawerState) scope.toggleDrawer();
			scope.currentBird = selected;
			return selected;
		};

		scope.toggleDrawer = function () {
			scope.drawerState = !scope.drawerState;
		};
		scope.$watch('showGraph', function(n, o){
			if(n) scope.drawerState = false;
		});
	}]);

	angular.element(document).ready(function() {
	  angular.bootstrap(document, ['BirdApp']);
	});
})();