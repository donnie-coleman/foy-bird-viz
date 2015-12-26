(function(){
	angular
	.module('bird-service')
	.service('birdService', ['birdParser', function(birdParser) {
		var getBirds = function (){
		  	return birdParser.getBirds();
		};
		var getBirdsByYear = function (year){
			return birdParser.getBirdsByYear(year);
		}
		return {getBirds:getBirds, getBirdsByYear:getBirdsByYear};
	}]);
})();