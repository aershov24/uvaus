var uvindex = require('./index.js');

uvindex.GetCurrentUVIndex('Perth', function(err, result){
  if (err) console.log(err);
  console.log(result);
});