(function(){
	angular
	.module('bird-service')
	.service('birdService', ['birdParser', function(birdParser) {
		var getBirds = function (){
		  	return birdParser.getBirds();
		};

		return {getBirds:getBirds};
	}]);
})();