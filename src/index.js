var request = require('request')
  , parser = require('xml2js').parseString;

var currentUVUrl = 'http://www.arpansa.gov.au/uvindex/realtime/xml/uvvalues.xml';

module.exports.GetCurrentUVIndex = function GetCurrentUVIndex(location, cb)
{
  if (!location) return cb({error: 'No location provided'});
  request(currentUVUrl, function (err, response, body) {
    if (err) return cb(err, null);
    if (response.statusCode != 200) return cb({ error: {statusCode: response.statusCode}}, null);
      parser(body, function(err, result){
        var locations = result.stations.location;
        for (var i = 0; i< locations.length; i++){
          if (locations[i].$.id == location.toLowerCase())
            return cb(err, { id: locations[i].name[0], 
              city: locations[i].$.id,
              index:  locations[i].index[0],
              time:  locations[i].time[0],
              date:  locations[i].date[0],
              fulldate:  locations[i].fulldate[0],
              status: locations[i].status[0]
            });
          }
        return cb({error: 'Location has not found'})
      });
  })
}