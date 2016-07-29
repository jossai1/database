
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AnswerSchema   = new Schema({
    questionID: String,
    response:String ,
    time : Number,
    date: String,
    mtgRoom: String
});

module.exports = mongoose.model('Answer', AnswerSchema);
