const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: {type:String, required:true},
  description: String,
  dueDate: Date,
  classId: { type: mongoose.Schema.Types.ObjectId, ref:"Class", required:true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true } // TEACHER/ADMIN
},{timestamps:true});
module.exports = mongoose.model("Homework", schema);
