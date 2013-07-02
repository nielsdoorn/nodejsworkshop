var util = require('util');
var Forecast = require('forecast.io');
var options = {
  APIKey: process.env.FORECAST_API_KEY,
  units: 'si'
};

forecast = new Forecast(options);

forecast.get(52.222371, 6.871626, function (err, res, data) {
  if (err) throw err;
  console.log(util.inspect(data.hourly.summary));
});