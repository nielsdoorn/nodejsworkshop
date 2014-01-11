var util = require('util');
var Forecast = require('forecast.io');

var options = {
  APIKey: process.env.FORECAST_API_KEY,
  units: 'si'
};

forecast = new Forecast(options);

forecast.get(51.513417, 7.456795, function (err, res, data) {
  if (err) throw err;
  console.log(util.inspect(data.hourly.summary));
});