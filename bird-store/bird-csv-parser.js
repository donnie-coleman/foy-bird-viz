(function(){
	angular
	.module('bird-service')
	.service('birdCSVParser', [function() {

		function parse(birdsByYear){
			var y = [ "Year", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
			var csv = [];

			_.each(birdsByYear.slice().reverse(), function(year){
				var x = [];
				var currentMonth = 0;
				
				x.push(year.year);

				_.each(year.byMonth, function(month, index){
					while(currentMonth < index){ //because gaps in data
						currentMonth++;
						x.push(0);						
					}
					x.push(_.size(month));	
					currentMonth++;
				});

				csv.push(x.join());
			});

			return y.join()+"\n"+csv.join("\n");
		}

		return {parse:parse};
	}]);
})();