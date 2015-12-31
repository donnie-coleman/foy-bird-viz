(function(){
  angular
    .module('bird-suggestion')
    .directive('birdSuggestion', [function() {
      return {
        replace: true,
        restrict: 'E',
        scope:{
          bird: '=',
          select: '&',
          next: '&'
        },
        templateUrl: 'suggestion.html'
      };
    }]);
})();