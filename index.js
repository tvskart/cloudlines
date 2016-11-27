let request = require('request'),
    _ = require('lodash'),
    jsonfile = require('jsonfile'),
    bodyParser = require('body-parser');

let config = require('./config');
jsonfile.spaces = 4;

let runStream = () => {
    console.log('starting stream');
    let url = config.api_host;
    let headers = {
        'Content-Type': 'application/json', 
        Authorization: 'Token token="'+config.api_token+'"'
    }
    let options = {url, headers}
    fetchData(options);
}

let fetchData = (options) => {
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
                var file = './data.json';
                //https://github.com/jprichardson/node-jsonfile#writefilefilename-obj-options-callback
                
                //IMP: Either append and update single json file OR OR OR bulk upload to ES
                jsonfile.writeFile(file, results, {flag: 'a'}, function (json_err) {
                    if (json_err) console.error(json_err);
                    fetchData(next_options);
                });
                
            } catch(err) {
                console.log("We’ve encountered parsing json error?: " + err); //couldnt parse, body not proper json
            }
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
}

runStream();