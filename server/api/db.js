/**
 * Created by linsha on 9/10/2017.
 */
var express = require('express');
var User = require('../models/user.js');
var BlamedIssue = require('../models/blamed-issue.js');
var WS = require('../io/web-sockets');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dogether', {useMongoClient: true}); // connect to our database
var router = express.Router();
//var WS = require('../io/web-sockets');
router.route('/issues/:id')
	.put(function (req, res) {
		BlamedIssue.update({'_id': req.params.id}, req.body, {upsert: true}
			, function (err) {
				if (err)
					res.send(err);
				res.json({message: 'Issue updated!'});
			});
	});

router.route('/users/:id/issues/:status').get(function (req, res) {
	//Should iterate over
	BlamedIssue.find({_user: req.params.id, 'is_blamed': {$eq: req.params.status}, 'reasons.predictive':true}, function (err, data) {
		if (err) {
			res.send(err);
		}
		res.json(data);
	}).populate('_user');
});

router.route('/users/issues/:status?').get(function (req, res) {
	//Should iterate over
	var query = {};
	if (req.params.status) {
		query['is_blamed'] = {$eq: req.params.status};
	}

	BlamedIssue.find(query, function (err, data) {
		if (err) {
			res.send(err);
		}
		res.json(data);
	}).populate('_user');
});


router.route('/users').get(function (req, res) {
	User.find({}, function (err, users) {
		if (err) {
			res.send(err);
		} else {
			res.json(users);
		}
	});
});

router.route('/users/:name').get(function (req, res) {
	User.find({name: req.params.name}, function (err, users) {
		if (err) {
			res.send(err);
		} else {
			res.json(users);
		}
	});
});

router.route('/accuracy').get(function (req, res) {
	User.find({name: req.params.name}, function (err, users) {
		if (err) {
			res.send(err);
		} else {
			res.json(users);
		}
	});
});


router.route('/mock').get(function (req, res) {
	res.json([
		{
			"_id": "59be44dd203ff30cb8b35f48",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 476062,
			"rootJobName": "MQM Root quick master",
			"tid": "com.hp.mqm.schema.upgrade.processes.UpgradeAndCompareTest#testCompareUpgrade[Unknown Team]",
			"test_name": "testCompareUpgrade[Unknown Team]",
			"test_class": "UpgradeAndCompareTest",
			"test_package": "com.hp.mqm.schema.upgrade.processes",
			"is_blamed": "None",
			"buildNumber": "81177",
			"__v": 0,
			"created_at": "2017-09-17T09:48:13.340Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59be44dd203ff30cb8b35f48",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 476063,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.schema.upgrade.processes.UpgradeAndCompareTest#testCompareUpgrade[Unknown Team]",
			"test_name": "testCompareUpgrade[Unknown Team]",
			"test_class": "UpgradeAndCompareTest",
			"test_package": "com.hp.mqm.schema.upgrade.processes",
			"is_blamed": "None",
			"buildNumber": "8177",
			"__v": 0,
			"created_at": "2017-09-17T09:48:13.340Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba4",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.schema.upgrade.processes.UpgradeAndCompareTest#testCompareUpgrade[Unknown Team]",
			"test_name": "testCompareUpgrade[Unknown Team]",
			"test_class": "UpgradeAndCompareTest",
			"test_package": "com.hp.mqm.schema.upgrade.processes",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.762Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba5",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis.FailureAnalysisOnItTests#clickingImOnItInGridView [MT #337086] [OCD Adi]",
			"test_name": "clickingImOnItInGridView [MT #337086] [OCD Adi]",
			"test_class": "FailureAnalysisOnItTests",
			"test_package": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.762Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba6",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites.UserIsableToSeeAndRunTestSuitesFromMyWork#UserCanRunATestSuiteWhichRepresentsACompoundTest [OMG Yuval]",
			"test_name": "UserCanRunATestSuiteWhichRepresentsACompoundTest [OMG Yuval]",
			"test_class": "UserIsableToSeeAndRunTestSuitesFromMyWork",
			"test_package": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.762Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba7",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.automatedtests.linkManualToAutomatedTest#see_automation_tasks_when_status_is_requires_update_in_my_work [OMG Shimon]",
			"test_name": "see_automation_tasks_when_status_is_requires_update_in_my_work [OMG Shimon]",
			"test_class": "linkManualToAutomatedTest",
			"test_package": "com.hp.ui.automation.tests.octane.tests.automatedtests",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.763Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba9",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.ps.businessrules.RunRuleEngineITCase#testSetMetadataRequiredFieldBizRule[PIE Shimon]",
			"test_name": "testSetMetadataRequiredFieldBizRule[PIE Shimon]",
			"test_class": "RunRuleEngineITCase",
			"test_package": "com.hp.mqm.ps.businessrules",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.764Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabba8",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.pipeline.pipelinemainview.PipelineWidgetsTests#failedTestsWidgetInPipelineMainView [MT #351002] [OCD Ido]",
			"test_name": "failedTestsWidgetInPipelineMainView [MT #351002] [OCD Ido]",
			"test_class": "PipelineWidgetsTests",
			"test_package": "com.hp.ui.automation.tests.octane.pipeline.pipelinemainview",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.763Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbaa",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis.FailureAnalysisFailedBuildsClassificationTests#buildsClassificationsInBuildIssuesWidget [MT #286046] [OCD Adi]",
			"test_name": "buildsClassificationsInBuildIssuesWidget [MT #286046] [OCD Adi]",
			"test_class": "FailureAnalysisFailedBuildsClassificationTests",
			"test_package": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.764Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbab",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.pipeline.commits.CommitsViaRestTests#pipelineCommitAndTestResultsLatest [MT #367014] [OCD Marina]",
			"test_name": "pipelineCommitAndTestResultsLatest [MT #367014] [OCD Marina]",
			"test_class": "CommitsViaRestTests",
			"test_package": "com.hp.ui.automation.tests.octane.pipeline.commits",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.765Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbae",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.infra.localizationL10N.UserLanguage#changeUserLanguageInWorkspace [MT #46000110] [OMG Daniel]",
			"test_name": "changeUserLanguageInWorkspace [MT #46000110] [OMG Daniel]",
			"test_class": "UserLanguage",
			"test_package": "com.hp.ui.automation.tests.octane.infra.localizationL10N",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.769Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbac",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.automatedtests.linkManualToAutomatedTest#link_manual_to_another_automated_test_replace [OMG Shimon]",
			"test_name": "link_manual_to_another_automated_test_replace [OMG Shimon]",
			"test_class": "linkManualToAutomatedTest",
			"test_package": "com.hp.ui.automation.tests.octane.tests.automatedtests",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.765Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbad",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites.UserIsableToSeeAndRunTestSuitesFromMyWork#UserCanRunOneRunFromATestSuiteWhichRepresentsARegressionEvent [OMG Yuval]",
			"test_name": "UserCanRunOneRunFromATestSuiteWhichRepresentsARegressionEvent [OMG Yuval]",
			"test_class": "UserIsableToSeeAndRunTestSuitesFromMyWork",
			"test_package": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.769Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbaf",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.app.entities.TeamSprintEntityITCase#testSprintFieldIsRequired[AGM Marina]",
			"test_name": "testSprintFieldIsRequired[AGM Marina]",
			"test_class": "TeamSprintEntityITCase",
			"test_package": "com.hp.mqm.app.entities",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.769Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb0",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.ps.businessrules.RunRuleEngineITCase#testCreateRelatedEntitiesFactBizRule[PIE Shimon]",
			"test_name": "testCreateRelatedEntitiesFactBizRule[PIE Shimon]",
			"test_class": "RunRuleEngineITCase",
			"test_package": "com.hp.mqm.ps.businessrules",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.769Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb1",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.qa.automation.upgrade.postvalidation.MQMUpgradePostValidationTest#upgradePostValidationTest_testAutomated[OMG_Daniel]",
			"test_name": "upgradePostValidationTest_testAutomated[OMG_Daniel]",
			"test_class": "MQMUpgradePostValidationTest",
			"test_package": "com.hp.mqm.qa.automation.upgrade.postvalidation",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.770Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb3",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.automatedtests.linkManualToAutomatedTest#run_an_automated_test_manually [OMG Shimon]",
			"test_name": "run_an_automated_test_manually [OMG Shimon]",
			"test_class": "linkManualToAutomatedTest",
			"test_package": "com.hp.ui.automation.tests.octane.tests.automatedtests",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.770Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb2",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis.FailureAnalysisGridTests#runHistoryFieldsInGridView [MT #336037] [OCD Adi]",
			"test_name": "runHistoryFieldsInGridView [MT #336037] [OCD Adi]",
			"test_class": "FailureAnalysisGridTests",
			"test_package": "com.hp.ui.automation.tests.octane.pipeline.failureanalysis",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.770Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb4",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.automatedtests.linkManualToAutomatedTest#link_manual_to_automated_test [OMG Shimon]",
			"test_name": "link_manual_to_automated_test [OMG Shimon]",
			"test_class": "linkManualToAutomatedTest",
			"test_package": "com.hp.ui.automation.tests.octane.tests.automatedtests",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.771Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb5",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.dashboard.summarygraph.UsingORFilterInSummaryGraph#orFilterInAutomatedRunsWidget [OMG Daniel]",
			"test_name": "orFilterInAutomatedRunsWidget [OMG Daniel]",
			"test_class": "UsingORFilterInSummaryGraph",
			"test_package": "com.hp.ui.automation.tests.octane.dashboard.summarygraph",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.771Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb8",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.settings.lists.ListTest#MoveListToHiddenState [OMG Jack]",
			"test_name": "MoveListToHiddenState [OMG Jack]",
			"test_class": "ListTest",
			"test_package": "com.hp.ui.automation.tests.octane.settings.lists",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.772Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb6",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.mqm.app.entities.commands.FeaturePostUpdateCommandITCase#testPlanFeatureRelease[Unknown Team]",
			"test_name": "testPlanFeatureRelease[Unknown Team]",
			"test_class": "FeaturePostUpdateCommandITCase",
			"test_package": "com.hp.mqm.app.entities.commands",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.771Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		},
		{
			"_id": "59c1cf3f9a96270a00eabbb7",
			"_user": {
				"_id": "59be44dd203ff30cb8b35f47",
				"name": "orens@hpe.com",
				"full_name": "Oren Schwartz",
				"avatar_id": "21004",
				"blamed_issues": [],
				"__v": 0
			},
			"pipelineRunId": 479059,
			"rootJobName": "MQM Root full master",
			"tid": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites.UserIsableToSeeAndRunTestSuitesFromMyWork#UserCanRunAllHisTestsFromTestSuiteWhichRepresentsARegressionEvent [OMG Yuval]",
			"test_name": "UserCanRunAllHisTestsFromTestSuiteWhichRepresentsARegressionEvent [OMG Yuval]",
			"test_class": "UserIsableToSeeAndRunTestSuitesFromMyWork",
			"test_package": "com.hp.ui.automation.tests.octane.tests.manualtest.testsuites",
			"is_blamed": "None",
			"buildNumber": "8256",
			"__v": 0,
			"created_at": "2017-09-20T02:15:27.771Z",
			"reasons": {
				"predictive": false,
				"appModules": false,
				"feature": false,
				"stacktrace": false
			}
		}])
});

module.exports = router;
