const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lectureTitle:  {type:String, required:true},
  description: {type:String, required:true},
  Lecture_URL: {type:String, required:true},
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
});

const LectureModel= mongoose.model('Lecture', lectureSchema);

module.exports = {LectureModel}