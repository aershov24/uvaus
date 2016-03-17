# readme

Retrieve a current and max UV Index for australian locations

## Installation

```
> npm install uvaus --save
```

## Usage

Get current UV Index for location 

```
var UVIndex = require("uvaus");

UVIndex.GetCurrentUVIndex("Sydney", function(err, result){
  if (err) console.log(err);
  console.log(result);
});
```

Get max UV Index for location 

```
UVIndex.GetMaxUVIndex("Sydney", function(err, result){
  if (err) console.log(err);
  console.log(result);
});
```
## Acknowledgments
All UV Index data and forecasts provided by the Bureau of Meteorology and Australian Radiation Protection and
Nuclear Safety Agency (ARPANSA). For more information visit www.bom.gov.au/uv and www.arpansa.gov.au/.