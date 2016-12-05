var express = require('express');
var jsonfile = require('jsonfile');
var api = require('./index.js');

var app = express();
//todo: add views, static, middleware parsers, etc
app.use(express.static(__dirname + '/public'));

app.get('/history.json', (req, res) => {
    var file = './history.json'
    var options = {
        root: __dirname
    }
    res.sendFile(file, options);
})

app.get('/stream.json', (req, res) => {
    var file = './stream.json'
    var options = {
        root: __dirname
    }
    res.sendFile(file, options);
})

// app.get('/stream', (req, res) => {
//     var file = './stream.json'
//     jsonfile.readFile(file, function(err, results) {
//         console.log('data size',results.length);
//         res.json(results);
//     });    
// })

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(3000, 'localhost', () => {
  console.log('App listening on http://localhost:3000');
  api.runStream(); //refreshes stream.json file periodically
})