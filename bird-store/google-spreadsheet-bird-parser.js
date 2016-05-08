(function () {
  Date.prototype.getDOY = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
  }

  angular
    .module('bird-service')
    .service('birdParser', ['$http', 'googleSpreadsheetKeys', function ($http, keys) {
      var url_start = "https://spreadsheets.google.com/feeds/list/";
      var url_end = "/1/public/values?alt=json-in-script&callback=JSON_CALLBACK";

      var getBirds = function () {
        var promises = [];
        //obtain a promise for each bird list
        _.each(keys, function (element, index, list) {
          //if cached and cache valid
          //return promise fulfilled by cache
          //else
          promises.push(getBirdsByKey(element.key));
        });
        return promises;
      };

      var getBirdsByYear = function (year) {
        var max = _.max(keys, function(key) { return key.year}).year;
        var min = _.min(keys, function(key) { return key.year}).year;

        if(!year || year > max){
          year = max;
        }
        else if (year < min) {
          year = min;
        }

        var element = _.findWhere(keys, {year: year.toString()});
        return getBirdsByKey(element.key);
      };

      var getBirdsByKey = function (key) {
        return _getBirdsByKey(key)
          .then(function (data) {
            //cache data
            return data;
          });
      };

      var _getBirdsByKey = function (key) {
        return $http({
          url: url_start + key + url_end,
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
      }

      return {
        getBirds: getBirds,
        getBirdsByYear: getBirdsByYear,
        getBirdsByKey: getBirdsByKey
      };
    }]);
})();