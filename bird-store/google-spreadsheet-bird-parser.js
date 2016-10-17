(function () {
  Date.prototype.getDOY = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
  };

  angular
    .module('bird-service')
    .service('birdParser', ['$http', 'googleSpreadsheetKeys', function ($http, keys) {
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
        return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: key,
          range: 'A1:F'
        })
        .then(
          function (data) {
            return processBirds(data.result.values);
          },
          function (response){
            console.error("gAPI error", response);
            return $q.reject('error');
          }
        )
      };

      var processBirds = function (entries) {
        var birds = [],
            DATE_COL = 0,
            BIRD_COL = 1,
            LOCATION_COL = 2,
            LOCATION_DESC_COL = 3,
            NOTES_COL = 4,
            LIFER_COL = 5,
            length = entries.length,
            previousDate,
            curr_day,
            curr_month,
            curr_year,
            curr_date,
            dayOfYear;

        for (var i = 1; i < length; i++) {
          var entry = entries[i],
            bird = entry[BIRD_COL],
            date = entry[DATE_COL],
            loc = entry[LOCATION_COL],
            locDesc = entry[LOCATION_DESC_COL] ? entry[LOCATION_DESC_COL] : null,
            notes = entry[NOTES_COL] ? entry[NOTES_COL] : null,
            lifer = entry[LIFER_COL] && entry[LIFER_COL] ? true : false;

          if(!loc || !date || !bird || loc.toUpperCase().indexOf('VT') === -1) continue; //only showing VT birds, for now...

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
        getBirds: getBirds,
        getBirdsByYear: getBirdsByYear,
        getBirdsByKey: getBirdsByKey
      };
    }]);
})();