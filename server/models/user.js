var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    full_name:String,
    avatar_id:String,
    // blamed_issues : [{ type: Schema.Types.ObjectId, ref: 'BlamedIssue'}]

});

 UserSchema.index({name: 1}, {unique: true});

module.exports = mongoose.model('User', UserSchema);
