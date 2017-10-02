// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var octane = require('./api/octane');
var db = require('./api/db');
var schedule = require('./api/schedule');
var cors = require('cors');
var later = require('later');
const requestIp = require('request-ip');
var CRON_EVERY_DAY = '15 2 * * ? *';
var CRON_NOTIFY_EVERY_MORNING = '0 9 * * ? *';



var s1 = later.parse.cron(CRON_EVERY_DAY);
// execute logTime for each successive occurrence of the text schedule
later.setInterval(function(){
	octane.processLatestRuns(
		function(){
			console.log('Done!');}
	);
}, s1);

var s2 = later.parse.cron(CRON_NOTIFY_EVERY_MORNING);
// execute logTime for each successive occurrence of the text schedule
later.setInterval(function(){
    octane.notifyAll(
        function(){
            console.log('Done!');}
    );
}, s2);



var port = process.env.PORT || 8787;        // set our port
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/ui', express.static('public'))


// ROUTES FOR OUR API
// =============================================================================

 var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
// app.use(function (req, res, next) {
//  //console.log(req.body) // populated!
//  next();
// });
app.use(function (req, res, next) {
	// do logging
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	const clientIp = requestIp.getClientIp(req);
	console.log('['+new Date().toISOString()+']['+clientIp+'] '+ fullUrl);
	next(); // make sure we go to the next routes and don't stop here
});
app.use('/api', octane.router);
app.use('/api', db);
app.use('/api', schedule);


// START THE SERVER
// =============================================================================

var server   = app.listen(port);
require('./io/web-sockets').init(server, app);
app.use('/api/mock',function(req,res,next){

		res.json({
				"morenol@nga": {
					"rootJobName":"FullPipeline",
					"buildNumber": 1231,
					"name": "morenol@nga",
					"full_name": "Louisa Moreno",
					"pipelineRunId": "1008",
					"blamed_issues": [
						{
							"tid": "com.octane.mock.package.TevO.CalcsTest#ValidateTests"
						},
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobConfiguration"
						},
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobStructure"
						}
					]
				},
				"castillor@nga": {
					"rootJobName":"FullPipeline",
					"buildNumber": 1,
					"name": "castillor@nga",
					"full_name": "Roxie Castillo",
					"pipelineRunId": "1008",
					"blamed_issues": [
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobConfiguration"
						},
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#ClearEnvironment"
						},
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobStructure"
						}
					]
				},
				"floresj@nga": {
					"buildNumber": 13,
					"rootJobName":"FullPipeline",
					"name": "floresj@nga",
					"full_name": "Jason Flores",
					"pipelineRunId": "1008",
					"blamed_issues": [
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobConfiguration"
						}
					]
				},
				"grahamm@nga": {
					"buildNumber": 24,
					"rootJobName":"FullPipeline",
					"name": "grahamm@nga",
					"full_name": "Manuel Graham",
					"pipelineRunId": "1008",
					"blamed_issues": [
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#ClearEnvironment"
						},
						{
							"tid": "com.octane.mock.package.TevO.CalcsTest#ClearEnvironment"
						},
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#UpdateEntity"
						}
					]
				},
				"jenkinsr@nga": {
					"buildNumber": 44,
					"rootJobName":"FullPipeline",
					"name": "jenkinsr@nga",
					"full_name": "Ricardo Jenkins",
					"pipelineRunId": "1008",
					"blamed_issues": [
						{
							"tid": "com.octane.mock.package.TevO.ValidationTest#GetJobStructure"
						}
					]
				}
			}
		);



});

console.log('Magic happens on port ' + port);