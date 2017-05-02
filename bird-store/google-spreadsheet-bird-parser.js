(function () {
  Date.prototype.getDOY = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
  };

  angular
    .module('bird-service')
    .constant("urlParams", {
      jsonCallback: '?alt=json-in-script&callback=JSON_CALLBACK'
    })
    .service('birdParser', ['$http', 'googleSpreadsheetKeys', '$q', 'urlParams', function ($http, googleSpreadsheet, $q, urlParams) {
      var workSheets;

      var init = function (){
        return googleSpreadsheet
          .getWorksheetUrls()
          .then(function(worksheetKeys){
            workSheets = _.sortBy(worksheetKeys, function(worksheet) { return worksheet.year; });
          });
      };

      var getBirds = function () {
        var promises = [];
        //obtain a promise for each bird list
        _.each(workSheets, function (element, index, list) {
          promises.push(getBirdsByKey(element.key));
        });

        return promises;
      };

      var getBirdsByYear = function (year) {
        var max = _.max(workSheets, function(workSheet) { return workSheet.year}).year;
        var min = _.min(workSheets, function(workSheet) { return workSheet.year}).year;

        if (!year) {
          year = max;
        }
        else if (year > max || year < min) {
          var deferred = $q.defer();
          deferred.reject();
          return deferred.promise;
        }

        var workSheet = _.findWhere(workSheets, {year: year.toString()});
        return getBirdsByKey(workSheet.key);
      };

      var getBirdsByKey = function (key) {
        return $http({
          url: key + urlParams.jsonCallback,
          method: "JSONP"
        })
        .then(function (data, status, headers, config) {
          return processBirds(data.data);
        });
      };

      var processBirds = function (json) {
        var birds = [],
          feed = json.feed,
          entries = feed.entry || [],
          COL_PREFIX = 'gsx$',
          DATE_COL = COL_PREFIX + 'date',
          BIRD_COL = COL_PREFIX + 'bird',
          LOCATION_COL = COL_PREFIX + 'location',
          LOCATION_DESC_COL = COL_PREFIX + 'locationdescription',
          NOTES_COL = COL_PREFIX + 'notes',
          LIFER_COL = COL_PREFIX + 'lifebird',
          length = entries.length,
          previousDate,
          previousMonth = 1,
          curr_day,
          curr_month,
          curr_year,
          curr_date,
          dayOfYear;

        for (var i = 0; i < length; i++) {
          var entry = entries[i],
            bird = entry[BIRD_COL].$t,
            date = entry[DATE_COL].$t,
            loc = entry[LOCATION_COL].$t,
            locDesc = entry[LOCATION_DESC_COL] ? entry[LOCATION_DESC_COL].$t : null,
            notes = entry[NOTES_COL] ? entry[NOTES_COL].$t : null,
            lifer = entry[LIFER_COL] && entry[LIFER_COL].$t ? true : false;

          if(loc.toUpperCase().indexOf('VT') === -1) continue; //only showing VT birds, for now...

          if (date && (previousDate != date)) {
            var d = new Date(date);
            if (!isNaN(d)) {
              previousDate = date;
              curr_day = d.getDay();
              curr_month = d.getMonth();
              curr_year = d.getFullYear();
              curr_date = d.getDate();
              dayOfYear = d.getDOY();
            }
          }

          birds.push({
              doy: dayOfYear,
              bird: bird,
              month: curr_month,
              year: curr_year,
              day: curr_day,
              date: curr_date,
              lifer: lifer,
              location: loc,
              locationDesc: locDesc,
              notes: notes,
              index: i
            }
          );
        }

        return {year: curr_year, birds: birds, total: i, byMonth: _.groupBy(birds, 'month'), timestamp: new Date()};
      };

      return {
        init : init,
        getBirds: getBirds,
        getBirdsByYear: getBirdsByYear,
        getBirdsByKey: getBirdsByKey
      };
    }]);
})();