(function(){
  angular
  .module('bird-service')
  .service('googleSpreadsheetKeys', ['$q', '$http', function ($q, $http){
    const worksheetId = '1e3Jrxj2PNqXwJ9z96LK1FzxYdg1Ate1bg2PDQ8vGXnI',
          worksheetUrl = `https://spreadsheets.google.com/feeds/worksheets/${worksheetId}/public/values?alt=json-in-script&callback=JSON_CALLBACK`;
    var worksheets;

    var fetchWorksheets = function (){
      if(worksheets) {
        console.log('returning cached worksheets');

        var deferred = $q.defer();
        deferred.resolve(worksheets);
        return deferred.promise;
      }
      else {
        console.log('fetching worksheets');

        return $http({
          url: worksheetUrl,
          method: "JSONP"
        })
        .then(function (data, status, headers, config) {
          return processWorksheets(data.data);
        });
      }
    };

    var processWorksheets = function (data){
      var entries = data.feed.entry || [];

      worksheets = entries.map(function (entry){
        return {year:entry['title']['$t'], key:entry.link[0]['href']};
      });

      return worksheets;
    };

    return { getWorksheetUrls: fetchWorksheets };
  }]);
})();
