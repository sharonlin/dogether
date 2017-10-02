/**
 * Created by linsha on 9/12/2017.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BlamedIssueSchema   = new Schema({
        _user : { type: Schema.Types.ObjectId, ref: 'User' },
        pipelineRunId:Number,
        tid:String,
        rootJobName:String,
        buildNumber:String,
        is_blamed:String,
        test_package:String,
        test_class:String,
        test_name:String,
        reasons: {
                stacktrace: { type: Boolean, default: false },
                feature: { type: Boolean, default: false },
                appModules: { type: Boolean, default: false },
                predictive: { type: Boolean, default: false },
        },
        comment:String,
        revision:String,
        created_at    : { type: Date, required: true, default: Date.now }
});

BlamedIssueSchema.index({_user: 1}, {pipelineRunId:1},{tid:1}, {rootJobName:1}, {unique: true});

module.exports = mongoose.model('BlamedIssue', BlamedIssueSchema);


