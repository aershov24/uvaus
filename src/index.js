var request = require('request')
  , JSFtp = require("jsftp")
  , parser = require('xml2js').parseString;

var currentUVUrl = 'http://www.arpansa.gov.au/uvindex/realtime/xml/uvvalues.xml';
var maxUVFTP = 'ftp2.bom.gov.au';
var maxUVFTPFile = '/anon/gen/fwo/IDYGP007.txt';

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
        return cb({error: 'Location has not found'}, null);
      });
  })
}

module.exports.GetMaxUVIndex = function GetMaxUVIndex(location, cb)
{
  if (!location) return cb({error: 'No location provided'});
  var ftp = new JSFtp({
    host: maxUVFTP,
  });

  var str = "";
  ftp.get(maxUVFTPFile, function(err, socket) {
    if (err) return cb(err, null);
    
    socket.setEncoding("utf8");
    socket.resume();
    socket.on("data", function(d) { 
      str += d.toString(); 
    })
    socket.on("error", function(err) {
      console.log(2);
      return cb(err, null);
    });
    socket.on("end", function() {
      ftp.raw.quit();
      
      if (str.indexOf(location) < 0)
        return cb({error: 'Location has not found'}, null);

      var str1 = str.substring(str.indexOf(location));
      var date = str1.substring(31, 20).trim();
      var uvmax = str1.substring(str1.indexOf("Max:")).substring(5,7).trim();
      var uvalertfrom = str1.substring(str1.indexOf("UV Alert from")).substring(14,19).trim();
      var uvalertto = str1.substring(str1.indexOf("UV Alert from")).substring(23,29).trim();

      return cb(null, { 
        city: location, 
        uvmax: uvmax, 
        date: date, 
        uvalert: { 
          from: uvalertfrom, 
          to: uvalertto
        }});
    });
  });
}