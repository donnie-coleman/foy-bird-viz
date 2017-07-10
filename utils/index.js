(function(){
	angular
	.module('utils', [])
  .filter('monthName', function() {
    return function(number) {
      if(isNaN(number)) return "";

      return ["January", "February", "March",
              "April", "May", "June",
              "July", "August", "September",
              "October", "November", "December"][number].substring(0,3);
    };
  })
  .filter('dayName', function() {
    return function(number) {
      if(isNaN(number)) return "";

      return [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][number].substring(0,3);
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
			if((reverse === "false" || reverse === false) && input){
				return _.clone(input).reverse();
			}
			else {
				return input;
			}
		}
	});
})();