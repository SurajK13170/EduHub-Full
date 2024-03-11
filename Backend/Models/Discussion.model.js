const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {type:String},
    timestamp: { type: Date, default: Date.now }
});

const discussionModel = mongoose.model('Discussion', discussionSchema);

module.exports = {discussionModel}
