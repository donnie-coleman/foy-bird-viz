(function(){
  angular
  .module('bird-service')
  .service('birdService', ['birdParser', function(birdParser) {
    var getBirds = function (){
      return birdParser.getBirds();
    };
    var getBirdsByYear = function (year){
      return birdParser.getBirdsByYear(year);
    };
    var init = function (){
      return birdParser.init();
    };
    return {init: init, getBirds:getBirds, getBirdsByYear:getBirdsByYear};
  }]);
})();