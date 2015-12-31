(function(){
	angular
	.module('utils', [])
	.filter('monthName', function() {
	  return function(number) {
	  			return [ "January", "February", "March", 
					     "April", "May", "June", 
						 "July", "August", "September", 
					     "October", "November", "December"][number];
			  };
	})	
	.filter('dayName', function() {
	  return function(number) {
	  			return [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][number];
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
	})
	.filter('timestamp', function(){
		return function(date){
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			seconds = seconds < 10 ? '0'+seconds : seconds;
			var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
			return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
		}
	});
})();