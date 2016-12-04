let request = require('request'),
    _ = require('lodash'),
    jsonfile = require('jsonfile'),
    bodyParser = require('body-parser');

let config = require('./config');
jsonfile.spaces = 4;

let runHistorical = () => {
    console.log('starting historical data');
    let url = config.api_host;
    let headers = {
        'Content-Type': 'application/json', 
        Authorization: 'Token token="'+config.api_token+'"'
    }
    let options = {url, headers}
    fetchHistoricalData(options);
}

let fetchHistoricalData = (options) => {
    console.log('fetch data');
    //https://github.com/request/request#custom-http-headers
    request(options, function (error, response, body) {
        if (!error && body) {
            try {
                let results = JSON.parse(body);
                let last_result = results[results.length - 1];
                let last_id = last_result.id - 100;
                console.log(last_id, results.length)
                let next_options = _.merge(options, {url: config.api_host + '?last_id=' + last_id});
                var file = './history.json';
                //https://github.com/jprichardson/node-jsonfile#writefilefilename-obj-options-callback
                
                //IMP: Either append and update single json file OR OR OR bulk upload to ES
                jsonfile.writeFile(file, results, {flag: 'a'}, function (json_err) {
                    if (json_err) console.error(json_err);
                    fetchHistoricalData(next_options);
                });
                
            } catch(err) {
                console.log("We’ve encountered parsing json error?: " + err); //couldnt parse, body not proper json
            }
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
}

let runStream = () => {
    console.log('starting stream');
    let url = config.api_host;
    let headers = {
        'Content-Type': 'application/json', 
        Authorization: 'Token token="'+config.api_token+'"'
    }
    let options = {url, headers}
    fetchStreamData(options);
}

let fetchStreamData = (options) => {
    console.log('fetch data');
    //https://github.com/request/request#custom-http-headers
    request(options, function (error, response, body) {
        if (!error && body) {
            try {
                let results = JSON.parse(body);
                let most_recent_result = results[0]; //first 
                let next_options;
                if (most_recent_result) {
                    let last_id = most_recent_result.id;
                    next_options = _.merge(options, {url: config.api_host + '?last_id=' + last_id});
                } else {
                    //no results
                    next_options = options;
                }
                
                console.log(results.length);
                var time_period = 10000;
                //https://github.com/jprichardson/node-jsonfile#writefilefilename-obj-options-callback
                
                //TODO: check empty results response and see if this code keeps repeating
                if (results.length > 0) {
                    var file = './stream.json';
                    jsonfile.writeFile(file, results, {flag: 'a'}, function (json_err) {
                        if (json_err) console.error(json_err);
                        setTimeout(() => {fetchStreamData(next_options)}, time_period);
                    });
                } else {
                    setTimeout(() => {fetchStreamData(next_options)}, time_period);
                }

                
            } catch(err) {
                console.log("We’ve encountered parsing json error?: " + err); //couldnt parse, body not proper json
            }
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
}

//Storing in json files allow us to avoid express app. We just periodically pick up from stream.json file.
// Storing in ES lets us periodically query for recent most data. Requires express app, etc. 
//runHistorical();
runStream();