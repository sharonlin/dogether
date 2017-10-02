/**
 * Created by linsha on 9/5/2017.
 */
var express = require('express');
var moment = require('moment');
var IO = require('../io/web-socketS');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');

var User = require('../models/user.js');
var BlamedIssue = require('../models/blamed-issue.js');
//var octaneServerURL = 'http://myd-vm10629.hpeswlab.net:8081';
var octaneServerURL = 'https://octane-center.saas.hpe.com';
var suspectedAPI = '/api/shared_spaces/1001/workspaces/1002/previous_runs?fields=id,failure_analysis_merged_report,run_id,on_it_id,test_id,test_package,test_class,test_name&query="(pipeline_run_id%3D%7Bid%3D{pipleine-run-id}%7D;run_status%3D%7Bid%3D%27list_node.run_status.failed%27%7D)"';
var latestRunsAPI = '/api/shared_spaces/1001/workspaces/1002/pipeline_runs?fields=creation_time,status,pipeline,build_ci_name&order_by=-creation_time&query=%22(pipeline={id={PIPELINE_ID}};status={id=%27list_node.pipeline_run_status.unstable%27||id=%27list_node.pipeline_run_status.failure%27};creation_time%20GT%20%27{FETCH_DAY}%27)%22'

var loginAPI = '/authentication/sign_in';
var ciContextsAPI = '/internal-api/shared_spaces/1001/workspaces/1002/analytics/ci/contexts?instance-id={instance-id}&job-ci-id={job-ci-id}&build-ci-id={build-ci-id}';
var octaneLoginURL = octaneServerURL + loginAPI;
var suspectedURL = octaneServerURL + suspectedAPI;
var pipelineContextURL = octaneServerURL + ciContextsAPI;
var latestRunsURL = octaneServerURL + latestRunsAPI;
var FULL_PIPELINE_ID = 51001;
var QUICK_PIPELINE_ID = 27001;
var cookieData = '';


function buildCIContextURL(uuid, rootJobName, buildNumber) {
	var url = pipelineContextURL;
	url = url.replace('{instance-id}', uuid);
	url = url.replace('{job-ci-id}', rootJobName);
	url = url.replace('{build-ci-id}', buildNumber);
	return url;
}

function buildBCURL(pipelineRunId) {
	var url = suspectedURL;
	url = url.replace('{pipleine-run-id}', pipelineRunId);
	return url;
}

function buildLatestRunsURL(pipelineId, featchDay) {
	var url = latestRunsURL;
	url = url.replace('{PIPELINE_ID}', pipelineId);
	url = url.replace('{FETCH_DAY}', featchDay);

	return url;
}

function doLogin(callback) {
	var options = {
		url: octaneLoginURL,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'HPECLIENTTYPE': 'HPE_MQM_UI',
			'Accept': 'application/json'
		},
		//body:'{"user":"sa@nga","password":"Welcome1"}'
		body: '{"user":"slin@hpe.com","password":"Gili.2011"}'
	};
	console.log('[' + new Date().toISOString() + ']' + options.url);
	request(options, function (error, response, body) {
		_log('Error:' + error);
		_log('StatusCode:' + response && response.statusCode);
		_log('body:' + body);
		handleCookie(response);
		callback(error);
	});
}

function _log(message) {
	console.log('[' + new Date().toISOString() + ']' + message);
}

/* GET users listing. */
function doCIContext(res, uuid, rootJobName, buildNumber, callback) {
	var options = {
		url: octaneLoginURL,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'HPECLIENTTYPE': 'HPE_MQM_UI',
			'Accept': 'application/json'
		},
		body: '{"user":"slin@hpe","password":"Gili.2011"}'
	};

	request(options, function (error, response, body) {
		_log('[Login] error:', error); // Print the error if one occurred
		_log('[Login] statusCode:', response && response.statusCode); // Print the response status code if a response was received
		_log('[Login] body:', body); // Print the HTML for the Google homepage.
		handleCookie(response);
		// pipelineContextURL.
		var url = buildCIContextURL(uuid, rootJobName, buildNumber);
		_log('Request:' + url);
		request({
			url: url,
			headers: {
				Cookie: cookieData,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'HPECLIENTTYPE': 'HPE_MQM_UI'
			}
		}, function (error, response, body) {
			_log('[ciContext]error:', error); // Print the error if one occurred
			_log('[ciContext]statusCode:', response && response.statusCode); // Print the response status code if a response was received
			_log('[ciContext]' + body);
			if (response.statusCode === 200) {
				var bodyAsJson = JSON.parse(body);
				if (bodyAsJson[0] && bodyAsJson[0].pipelineRunId) {
					callback(res, bodyAsJson[0].pipelineRunId, rootJobName, buildNumber);
				} else {
					res.send('Failure!!!');
				}
			} else {
				res.send('Failure!!!');
			}
		});
	});
}


function doBC(pipelineRunId, rootJobName, buildNumber, callback) {
	var url = buildBCURL(pipelineRunId);
	_log('Request:' + url);
	request({
		url: url,
		headers: {
			Cookie: cookieData,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'HPECLIENTTYPE': 'HPE_MQM_UI'
		}
	}, function (error, response, body) {
		_log('error:', error); // Print the error if one occurred
		_log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		if (response.statusCode === 200) {
			analyzeBCData(pipelineRunId, rootJobName, buildNumber, JSON.parse(body), callback);
		}
	});
}

function doLatestRuns(pipelineId, callback) {
	var url = buildLatestRunsURL(pipelineId, prevDay());
	_log('doLatestRuns [' + prevDay() + ']:' + url);
	request({
		url: url,
		headers: {
			Cookie: cookieData,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'HPECLIENTTYPE': 'HPE_MQM_UI'
		}
	}, function (error, response, body) {
		_log('error:', error); // Print the error if one occurred
		_log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		callback(error, body);
	});
}


function prevDay() {
	var d = new Date(); //Today
	d.setDate(d.getDate() - 1); // Yesterday
	return d.toISOString().substr(0, 10) + 'T00:00:00Z';
}


function analyzeBCData(pipelineRunId, rootJobName, buildNumber, body) {
	_log('================Analyze BC Data ' + rootJobName + ',#' + buildNumber + ',' + pipelineRunId + '=================');
	var map = {};
	body.data.forEach(function (tr) {
		//go over suspected committers
		if (tr.failure_analysis_merged_report && tr.failure_analysis_merged_report.suspectedCommits) {//we have suspected report

			tr.failure_analysis_merged_report.suspectedCommits.forEach(function (sc) {//suspected commits
				if (!sc.workspaceUser) {
					console.log('No Workspace User, skipp');
					return;
				}
				if (!map[sc.workspaceUser.name]) {
					map[sc.workspaceUser.name] = {
						name: sc.workspaceUser.name,
						full_name: sc.workspaceUser.fullName,
						avatar_id: sc.workspaceUser.id,
						blamed_issues:
							[{
								tid: tr.test_package + '.' + tr.test_class + '#' + tr.test_name,
								pipelineRunId: pipelineRunId,
								rootJobName: rootJobName,
								buildNumber: buildNumber,
								is_blamed: 'None',
								test_package: tr.test_package,
								test_class: tr.test_class,
								test_name: tr.test_name,
								reasons: {
									stacktrace: sc.reasons.stacktrace,
									feature: sc.reasons.feature,
									appModules: sc.reasons.appModules,
									predictive: sc.reasons.hasOwnProperty('predictive') ? sc.reasons.predictive : false
								},
								comment: sc.comment,
								revision: sc.revision
							}]
					};
				} else {
					map[sc.workspaceUser.name].blamed_issues.push({
						tid: tr.test_package + '.' + tr.test_class + '#' + tr.test_name, pipelineRunId: pipelineRunId,
						rootJobName: rootJobName,
						buildNumber: buildNumber, is_blamed: 'None',
						test_package: tr.test_package,
						test_class: tr.test_class,
						test_name: tr.test_name,
						reasons: {
							stacktrace: sc.reasons.stacktrace,
							feature: sc.reasons.feature,
							appModules: sc.reasons.appModules,
							predictive: sc.reasons.hasOwnProperty('predictive') ? sc.reasons.predictive : false
						},
						comment: sc.comment,
						revision: sc.revision
					});
				}

			})
		}
	});

	var numberOfSC = 0;
	var numberOfIssues = 0;
	for (var key in map) {
		if (map.hasOwnProperty(key)) {
			_log('Suspected User:' + key);
			numberOfSC++;
			numberOfIssues += map[key].blamed_issues.length;
			upsertData(map[key]);
		}
	}
	_log('===================== Suspected Committers:' + numberOfSC + ', Number of issues:' + numberOfIssues + '============');
	return map;
}

// function analyzeBCData(pipelineRunId, rootJobName, buildNumber, body) {
// 	_log('================Analyze BC Data ' + rootJobName + ',#' + buildNumber + ',' + pipelineRunId + '=================');
// 	var map = {};
// 	body.data.forEach(function (tr) {
// 		//go over suspected committers
// 		if (tr.suspected_committers) {
// 			tr.suspected_committers.data.forEach(function (sc) {
// 				if (!map[sc.name]) {
// 					map[sc.name] = {
// 						name: sc.name,
// 						full_name: sc.full_name,
// 						avatar_id: sc.id,
// 						blamed_issues: [{
// 							tid: tr.test_package + '.' + tr.test_class + '#' + tr.test_name,
// 							pipelineRunId: pipelineRunId,
// 							rootJobName: rootJobName,
// 							buildNumber: buildNumber,
// 							is_blamed: 'None',
// 							test_package: tr.test_package,
// 							test_class: tr.test_class,
// 							test_name: tr.test_name
// 						}]
// 					};
// 				} else {
// 					map[sc.name].blamed_issues.push({
// 						tid: tr.test_package + '.' + tr.test_class + '#' + tr.test_name, pipelineRunId: pipelineRunId,
// 						rootJobName: rootJobName,
// 						buildNumber: buildNumber, is_blamed: 'None',
// 						test_package: tr.test_package,
// 						test_class: tr.test_class,
// 						test_name: tr.test_name
// 					});
// 				}
// 			});
// 		}
// 	});
// 	var numberOfSC = 0;
// 	var numberOfIssues = 0;
// 	for (var key in map) {
// 		if (map.hasOwnProperty(key)) {
// 			_log('Suspected User:' + key);
// 			numberOfSC++;
// 			numberOfIssues += map[key].blamed_issues.length;
// 			upsertData(map[key]);
// 		}
// 	}
// 	_log('===================== Suspected Committers:' + numberOfSC + ', Number of issues:' + numberOfIssues + '============');
// 	return map;
// }

function upsertData(user) {
	User.findOne({name: user.name}, function (err, data) {
		// IF it exists then update issues
		if (data) {
			createIssues(data._id, user.blamed_issues);
			// IF it does NOT exist then create new
		} else if (!data) {

			createUser(user);
		}
	});
}

function createUser(user) {
	_log('Create new user' + user.name);
	var u = new User({name: user.name, full_name: user.full_name, avatar_id: user.avatar_id});
	u.save(function (err) {
		if (err) {
			console.log(err);
			throw err;
		}
		createIssues(u._id, user.blamed_issues);
	});
}

function createIssues(uid, blamed_issues) {
	_log('Add ' + blamed_issues.length + ' issues for ' + uid);
	var blamedIssuesBatch = [];
	blamed_issues.forEach(function (bi) {
		var blamedIssue = new BlamedIssue(bi);
		blamedIssue._user = uid;
		blamedIssuesBatch.push(blamedIssue);
	});

	blamedIssuesBatch.forEach(function (bi) {
		BlamedIssue.update(
			{_user: bi._user, tid: bi.tid, pipelineRunId: bi.pipelineRunId, rootJobName: bi.rootJobName},
			{$setOnInsert: bi},
			{upsert: true},
			function (err, numAffected) {
				if (err) {
					_log(err);
				} else {
					//console.log('Add issue ' + bi.tid + ' for user ' + bi._user);
					console.dir(numAffected);
				}
			}
		);
	});
}

router.get('/octane/ci/context/:uuid/:jobName/:buildNumber', function (req, res, next) {
	res.send(analyzeBCData(req.params.buildNumber, req.params.jobName, req.params.buildNumber, mockBody()));
});

router.get('/octane/bc/', function (req, res, next) {
	//res.send(analyzeBCData(1234,"Quick",5, mockOctaneRunsDetailed()));
	processLatestRuns(function () {
		_log('processLatestRuns Activated');
	})
	res.send('processFullPipeline Started');
});


function mockBody(index) {
	var mockDataArray = [
		{
			"data": [
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "A",
					"test_name": "testA11",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Dan Moskovich",
							"name": "dan.moskovich@hpe.com",
							"id": "8001"
						}, {"type": "workspace_user", "full_name": "Zvi Vichter", "name": "zvi.vichter@hpe.com", "id": "60001"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "A",
					"test_name": "testA2222",
					"suspected_committers": {
						"total_count": 3,
						"data": [{"type": "workspace_user", "full_name": "Idan Bauer", "name": "idan.bauer@hpe.com", "id": "4021"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "A",
					"test_name": "testA3",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Sami Kashbi",
							"name": "sami@hpe.com",
							"id": "60001"
						}, {"type": "workspace_user", "full_name": "Sharon Lin", "name": "slin@hpe.com", "id": "4021"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "B",
					"test_name": "testB1",
					"suspected_committers": {
						"total_count": 3,
						"data": [{"type": "workspace_user", "full_name": "Idan Bauer", "name": "idan.bauer@hpe.com", "id": "4021"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "B",
					"test_name": "testB2",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Zvi Vichter",
							"name": "zvi.vichter@hpe.com",
							"id": "60001"
						}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "B",
					"test_name": "testB3",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Kuku",
							"name": "kuku@hpe.com",
							"id": "8001"
						}, {"type": "workspace_user", "full_name": "FoFo", "name": "fofo@hpe.com", "id": "60001"}]
					}
				}
			]
		},
		{
			"data": [
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "A",
					"test_name": "testA11",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Dan Moskovich",
							"name": "dan.moskovich@hpe.com",
							"id": "8001"
						}, {"type": "workspace_user", "full_name": "Zvi Vichter", "name": "zvi.vichter@hpe.com", "id": "60001"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "C",
					"test_name": "testC",
					"suspected_committers": {
						"total_count": 3,
						"data": [{"type": "workspace_user", "full_name": "Idan Bauer", "name": "idan.bauer@hpe.com", "id": "4021"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "D",
					"test_name": "testD",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Zvi Vichter",
							"name": "zvi.vichter@hpe.com",
							"id": "60001"
						}]
					}
				},
			]
		},
		{
			"data": [
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics2",
					"test_class": "A",
					"test_name": "testA11",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Dan Moskovich",
							"name": "dan.moskovich@hpe.com",
							"id": "8001"
						}, {"type": "workspace_user", "full_name": "Zvi Vichter", "name": "zvi.vichter@hpe.com", "id": "60001"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics2",
					"test_class": "E",
					"test_name": "testE",
					"suspected_committers": {
						"total_count": 3,
						"data": [{"type": "workspace_user", "full_name": "Idan Bauer", "name": "idan.bauer@hpe.com", "id": "4021"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics3",
					"test_class": "F",
					"test_name": "testF",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Sami Kashbi",
							"name": "sami@hpe.com",
							"id": "60001"
						}, {"type": "workspace_user", "full_name": "Sharon Lin", "name": "slin@hpe.com", "id": "4021"}]
					}
				},
			]
		},
		{
			"data": [
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "A",
					"test_name": "testA11",
					"suspected_committers": {
						"total_count": 3,
						"data": [{
							"type": "workspace_user",
							"full_name": "Dan Moskovich",
							"name": "dan.moskovich@hpe.com",
							"id": "8001"
						}, {"type": "workspace_user", "full_name": "Zvi Vichter", "name": "zvi.vichter@hpe.com", "id": "60001"}]
					}
				},
				{
					"type": "run_history",
					"test_package": "com.hp.mqm.analytics",
					"test_class": "B",
					"test_name": "testB1",
					"suspected_committers": {
						"total_count": 3,
						"data": [{"type": "workspace_user", "full_name": "Idan Bauer", "name": "idan.bauer@hpe.com", "id": "4021"}]
					}
				},
			]
		}
	]
	return mockDataArray[index];
}

function mockOctaneRunsDetailed() {
	return {
		"total_count": 67,
		"data": [
			{
				"type": "run_history",
				"run_id": 999741,
				"suspected_committers": {
					"total_count": 1,
					"data": [
						{
							"type": "workspace_user",
							"full_name": "Noam Kachko",
							"name": "noam.kachko@hpe.com",
							"id": "5001"
						}
					]
				},
				"on_it_id": {
					"type": "workspace_user",
					"full_name": "Ehud Zeidman",
					"name": "ehud.zeidman@hpe.com",
					"id": "41002"
				},
				"failure_analysis_merged_report": {
					"id": "3108055606",
					"suspectedCommits": [
						{
							"id": 593039,
							"reasons": {
								"stacktrace": false,
								"feature": false,
								"appModules": true,
								"predictive": true
							},
							"files": [
								{
									"scmChangeId": 442244,
									"fileRank": 0.0,
									"changeType": "edit",
									"filePath": "QA/mqm-qa-rest-test/mqm-qa-rest-test-api/src/main/java/com/hp/mqm/qa/rest/api/validators/RestDataValidator.java",
									"risk": false
								}
							],
							"scmUser": "noam.kachko",
							"revision": "85205f321ae62559159b4cee349bac7ba389ed09",
							"time": "2017-09-24T06:27:00Z",
							"comment": "user story #426111: change writer command to support bulk",
							"risk": false,
							"repositories": [
								{
									"id": 1001,
									"url": "ssh://git@mydtbld0005.hpeswlab.net:7999/mqm/mqm.git",
									"branch": "detached",
									"name": "mqm/detached",
									"scmDiff": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/commits/{revision}#{filePath}",
									"scmSourceView": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/browse/{filePath}?at={revision}"
								},
								{
									"id": 4001,
									"url": "ssh://git@mydtbld0005.hpeswlab.net:7999/mqm/mqm.git",
									"branch": "origin/master",
									"name": "mqm/master",
									"scmDiff": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/commits/{revision}#{filePath}",
									"scmSourceView": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/browse/{filePath}?at={revision}"
								}
							],
							"workItems": [
								{
									"id": 426111,
									"name": "change writer command to support bulk",
									"type": "story"
								}
							],
							"workspaceUser": {
								"id": 5001,
								"name": "noam.kachko@hpe.com",
								"fullName": "Noam Kachko"
							}
						},
						{
							"id": 593039,
							"reasons": {
								"stacktrace": false,
								"feature": true,
								"appModules": false
							},
							"files": [
								{
									"scmChangeId": 442244,
									"fileRank": 0.0,
									"changeType": "edit",
									"filePath": "QA/mqm-qa-rest-test/mqm-qa-rest-test-api/src/main/java/com/hp/mqm/qa/rest/api/validators/RestDataValidator.java",
									"risk": false
								}
							],
							"scmUser": "noam.kachko",
							"revision": "85205f321ae62559159b4cee349bac7ba389ed09",
							"time": "2017-09-24T06:27:00Z",
							"comment": "user story #426111: change writer command to support bulk",
							"risk": false,
							"repositories": [
								{
									"id": 1001,
									"url": "ssh://git@mydtbld0005.hpeswlab.net:7999/mqm/mqm.git",
									"branch": "detached",
									"name": "mqm/detached",
									"scmDiff": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/commits/{revision}#{filePath}",
									"scmSourceView": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/browse/{filePath}?at={revision}"
								},
								{
									"id": 4001,
									"url": "ssh://git@mydtbld0005.hpeswlab.net:7999/mqm/mqm.git",
									"branch": "origin/master",
									"name": "mqm/master",
									"scmDiff": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/commits/{revision}#{filePath}",
									"scmSourceView": "http://mydtbld0005.hpeswlab.net:7990/projects/MQM/repos/mqm/browse/{filePath}?at={revision}"
								}
							],
							"workItems": [
								{
									"id": 426111,
									"name": "change writer command to support bulk",
									"type": "story"
								}
							],
							"workspaceUser": {
								"id": 5001,
								"name": "noam.kachko@hpe.com",
								"fullName": "Noam Kachko"
							}
						}
					]
				},
				"test_package": "com.hp.mqm.bl.platform",
				"es_id": "3108055606",
				"test_class": "BlDraftModeITCase",
				"id": 3108055606,
				"test_name": "testDraftMode[5]",
				"test_id": 383016
			}]
	};
}

function mockOctaneRuns() {
	return {
		"total_count": 2,
		"data": [
			{
				"type": "pipeline_run",
				"workspace_id": 1002,
				"creation_time": "2017-09-14T08:23:10Z",
				"pipeline": {
					"type": "pipeline",
					"activity_level": null,
					"name": "Dev Quick Root master DS (Mock)",
					"id": "1001"
				},
				"build_ci_name": "3",
				"success_tests": 3,
				"id": "1003",
				"skipped_tests": 1,
				"failed_tests": 4,
				"status": {
					"type": "list_node",
					"activity_level": null,
					"logical_name": "list_node.pipeline_run_status.failure",
					"name": "Failure",
					"index": 1,
					"id": "list_node.pipeline_run_status.failure"
				}
			},
			{
				"type": "pipeline_run",
				"workspace_id": 1002,
				"creation_time": "2017-09-14T08:23:01Z",
				"pipeline": {
					"type": "pipeline",
					"activity_level": null,
					"name": "Dev Quick Root master DS (Mock)",
					"id": "1001"
				},
				"build_ci_name": "1",
				"success_tests": 1,
				"id": "1001",
				"skipped_tests": 1,
				"failed_tests": 6,
				"status": {
					"type": "list_node",
					"activity_level": null,
					"logical_name": "list_node.pipeline_run_status.failure",
					"name": "Failure",
					"index": 1,
					"id": "list_node.pipeline_run_status.failure"
				}
			}
		],
		"exceeds_total_count": false
	};
}

function processLatestRuns(done) {
	_log('Start processLatestRuns');
	doLogin(function (err) {
			if (!err) {
				processFullPipeline(function () {
					processQuickPipeline(done);
				});
			}
		}
	);
}

function processFullPipeline(callback) {
	doLatestRuns(FULL_PIPELINE_ID, function (err, body) {
		_log('Process LatestRuns');
		bodyAsJson = JSON.parse(body);
		var i = 0;
		var interval = 10 * 1000;
		var nItems = bodyAsJson.data.length;
		_log('*************************************************************');
		_log('*\t\tFull Pipeline Processing ' + nItems + ' entries');
		_log('*************************************************************');


		bodyAsJson.data.forEach(function (run) {
			setTimeout(function (i) {
				_log('================Analyze BC Data ' + run.pipeline.name + ',#' + run.build_ci_name + ',(' + run.id + ')=================');
				doBC(run.id, run.pipeline.name, run.build_ci_name);
			}, interval * i, i);
			i++;
			if (nItems === i) {
				callback();
			}
		});
	});
}

function processQuickPipeline(callback) {
	doLatestRuns(QUICK_PIPELINE_ID, function (err, body) {
		_log('Process LatestRuns');
		bodyAsJson = JSON.parse(body);
		var i = 0;
		var interval = 10 * 1000;
		var nItems = bodyAsJson.data.length;
		_log('*************************************************************');
		_log('*\t\tQuick Pipeline Processing ' + nItems + ' entries');
		_log('*************************************************************');
		bodyAsJson.data.forEach(function (run) {
			setTimeout(function (i) {
				_log('Process Data:' + run.pipeline.name + ',' + run.id + ',' + run.build_ci_name);
				doBC(run.id, run.pipeline.name, run.build_ci_name);
			}, interval * i, i);
			i++;
			if (nItems === i) {
				_log('============== Done processing =======================');
				callback();
			}
		});
	});
}

function handleCookie(response) {
	var setcookie = response.headers["set-cookie"];
	cookieData = '';
	var i = 0;
	for (i = 0; i < setcookie.length; i++) {
		if (i < setcookie.length - 1) {
			cookieData += setcookie[i].split(';')[0] + '; ';
		} else {
			cookieData += setcookie[i].split(';')[0];
		}
	}
}

function groupIssuesByUser(callback) {
	aggregatorOpts = [
		{
			$match: {
				"is_blamed": "None",
				"reasons.predictive":true
			}
		},
		{
			$group: {
				_id: "$_user",
				count: {$sum: 1}
			}
		}];

	BlamedIssue.aggregate(aggregatorOpts).exec().then(function (data) {
		if (data) {
			User.populate(data, {path: "_id"}, function (err, populatedData) {

				callback(err, populatedData);
			});
		} else {
			callback('No Data');
		}
	}).catch(function (err) {
		// just need one of these
		callback(err);
	});
}

router.route('/accuracy').get(function (req, res) {
	function _groupIssuesAccuracy(callback) {
		const aggregatorOpts = [
			{
				$group: {
					_id: "$is_blamed",
					count: {$sum: 1}
				}
			}
		]

		BlamedIssue.aggregate(aggregatorOpts).exec().then(function (data) {
			if (data) {
				callback(null, data);
			} else {
				callback('No Data');
			}
		}).catch(function (err) {
			// just need one of these
			callback(err);
		});
	}

	_log('accuracy');
	_groupIssuesAccuracy(function (err, data) {
		if (!err) {
			res.send(data);
		} else {
			res.send(err);
		}
	})
});

router.route('/wrongAccuracyByUser').get(function (req, res) {
	function _groupIssuesAccuracy(callback) {
		const aggregatorOpts = [
			{
				$match: {
					"is_blamed": "wrong"
				}
			},
			{
				$group: {
					_id: "$_user",
					count: {$sum: 1},
				}
			}
		]

		BlamedIssue.aggregate(aggregatorOpts).exec().then(function (data) {
			if (data) {
				User.populate(data, {path: "_id"}, function (err, populatedData) {

					callback(err, populatedData);
				});

			} else {
				callback('No Data');
			}
		}).catch(function (err) {
			// just need one of these
			callback(err);
		});
	}

	_log('accuracy');
	_groupIssuesAccuracy(function (err, data) {
		if (!err) {
			res.send(data);
		} else {
			res.send(err);
		}
	})
});
router.route('/rightAccuracyByUser').get(function (req, res) {
	function _groupIssuesAccuracy(callback) {
		const aggregatorOpts = [
			{
				$match: {
					"is_blamed": "right"
				}
			},
			{
				$group: {
					_id: "$_user",
					count: {$sum: 1},
				}
			}
		]

		BlamedIssue.aggregate(aggregatorOpts).exec().then(function (data) {
			if (data) {
				User.populate(data, {path: "_id"}, function (err, populatedData) {

					callback(err, populatedData);
				});

			} else {
				callback('No Data');
			}
		}).catch(function (err) {
			// just need one of these
			callback(err);
		});
	}

	_log('accuracy');
	_groupIssuesAccuracy(function (err, data) {
		if (!err) {
			res.send(data);
		} else {
			res.send(err);
		}
	})
});
router.route('/totalAccuracyByUser/:sortBy?').get(function (req, res) {
	function _groupIssuesAccuracy(callback) {
		var sortBy = 'Wrong';
		if (req.params.sortBy) {
			sortBy = req.params.sortBy;
		}

		var sort = {};
		sort[sortBy] = -1;

		aggregatorOpts = [

			{
				"$group": {
					"_id": "$_user",
					"total": {"$sum": 1},
					"Success": {
						"$sum": {
							"$cond": [{"$eq": ["$is_blamed", "right"]}, 1, 0]
						}
					},
					"Wrong": {
						"$sum": {
							"$cond": [{"$eq": ["$is_blamed", "wrong"]}, 1, 0]
						}
					},
					"None": {
						"$sum": {
							"$cond": [{"$eq": ["$is_blamed", "None"]}, 1, 0]
						}
					}
				},
			},
			{$sort: sort},
			{$limit: 5}
		];


		BlamedIssue.aggregate(aggregatorOpts).exec().then(function (data) {
			if (data) {
				User.populate(data, {path: "_id"}, function (err, populatedData) {

					callback(null, populatedData);
				});

			} else {
				callback('No Data');
			}
		}).catch(function (err) {
			// just need one of these
			callback(err);
		});
	}

	_log('accuracy');
	_groupIssuesAccuracy(function (err, data) {
		if (!err) {
			res.send(data);
		} else {
			res.send(err);
		}
	})
});

function notifyAll(callback) {
	groupIssuesByUser(function (err, data) {
		if (!err) {
			data.forEach(function (entry) {
				IO.notify(entry._id.name, entry.count);
			})
			callback(err, data);
		} else {
			_log('groupIssuesByUser error');
			_log(err);
			callback(err);
		}
	})
}

router.route('/notifyAll').get(function (req, res) {
	_log('Activate notifyAll');
	notifyAll(function (err, data) {
		if (!err) {
			res.send(data);
		} else {
			res.send(err);
		}
	})

});

module.exports = {
	processLatestRuns: processLatestRuns,
	notifyAll: notifyAll,
	router: router
};
