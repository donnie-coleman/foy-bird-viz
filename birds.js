(function(){
  angular
  .module('BirdApp', ['bird-service', 'bird-list', 'utils', 'bird-info', 'month-picker', 'ngTouch'])
  .controller('BirdsCtrl', ['$scope', 'birdService', '$q', '$filter', function(scope, birdService, $q, $filter) {
    scope.reverse = true;
    scope.lifers = false;
    scope.birdLists = [];
    scope.drawerState = false;
    scope.initBird = "";
    scope.currentBird = "";
    scope.selectedMonths = [];
    scope.isHandheld = window.innerWidth <= 1100;
    scope.monthFilter = false;
    scope.currentYearIndex = 0;
    scope.showDiff = false;
    scope.refreshed = false;

    // populate the birdLists
    birdService
      .init()
      .then(function(){
        $q.all(scope.populateBirdLists())
          .then(function(datas){
            if(!datas.length) return;
            scope.birdLists = datas;

            // select the first bird in the latest list
            var latestList = _.last(scope.birdLists).birds;
            scope.initBird = scope.selectBird(scope.reverse ? _.last(latestList) : _.first(latestList), true);
          });
      });

    scope.populateBirdLists = function() {
      return scope.isHandheld ? [birdService.getBirdsByYear()] : birdService.getBirds();
    };

    scope.getBirdLists = function() {
      if(scope.birdLists.length && scope.isHandheld){
        return [scope.birdLists[scope.currentYearIndex]];
      }
      else {
        return scope.birdLists;
      }
    };

    scope.loadNewYear = function(swipeRight) {
      if(!scope.isHandheld || (swipeRight && scope.currentYearIndex === 0)) return; // can't load next year

      var nextYearIndex = scope.currentYearIndex;
      swipeRight ? nextYearIndex-- : nextYearIndex++;

      var nextYear = scope.birdLists[scope.currentYearIndex].year;
      swipeRight ? nextYear++ : nextYear--;

      if(!scope.birdLists[nextYearIndex]) {
        birdService
          .getBirdsByYear(nextYear)
          .then(function (data) {
            scope.birdLists.push(data);
            scope.currentYearIndex = nextYearIndex;
          });
      }
      else {
        scope.currentYearIndex = nextYearIndex;
      }
    };

    scope.refreshList = function (list) {
      birdService.getBirdsByYear(list.year)
      .then(function(data){
        scope.birdLists[scope.currentYearIndex] = data;
        scope.refreshed = true;
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

    scope.$watchGroup(['showDiff', 'currentYearIndex', 'refreshed'], function() {
      if(scope.birdLists && scope.showDiff  && !scope.shownDiff) {
        // if lists were loaded all at once, the current year is last
        // if the lists were loaded one by one, the current year is first
        let thisYearsBirdList = !scope.isHandheld ? _.last(scope.birdLists) : _.first(scope.birdLists);
        let thisYear = thisYearsBirdList.year;
        let thisYearsBirds = thisYearsBirdList.birds.map(function (bird) {
          return bird.bird;
        });

        scope.birdLists.forEach(function (year) {
          if (year.year == thisYear) return;

          Object.keys(year.byMonth).forEach(function (i) {
            let month = year.byMonth[i];
            month.forEach(function (bird) {
              if (_.contains(thisYearsBirds, bird.bird)) {
                bird.alreadyFound = true;
              }
              else {
                bird.alreadyFound = false;
              }
            });
          });
        });
        scope.refreshed = false;
      }
    });
  }]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['BirdApp']);
  });
})();