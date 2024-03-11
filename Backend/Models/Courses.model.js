const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseName: { type: String, required: true, unique:true },
    description: { type: String, required: true },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

const courseModel = mongoose.model('Course', courseSchema);

module.exports = { courseModel }

