const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {type:String, required:true},
  age: {type:Number, required:true},
  email: {type:String, required:true},
  password: {type:String, required:true},
  role:{type:String, default:"STUDENT", enum:["STUDENT","ADMIN", "SUPER_ADMIN"]},
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

});

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel}
