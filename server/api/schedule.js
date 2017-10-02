/**
 * Created by linsha on 9/10/2017.
 */
var express = require('express');
var later = require('later');
var router = express.Router();
var CRON_EVERY_DAY = '15 2 * * ? *';
var CRON_NOTIFY_EVERY_MORNING = '0 9 * * ? *';


router.route('/schedule/octane/:n')
	.get(function (req, res) {
		var s = later.parse.cron(CRON_EVERY_DAY);
		res.send(later.schedule(s).next(req.params.n));
	});

router.route('/schedule/notify/:n')
	.get(function (req, res) {
		var s = later.parse.cron(CRON_NOTIFY_EVERY_MORNING);
		res.send(later.schedule(s).next(req.params.n));
	});

module.exports = router;
