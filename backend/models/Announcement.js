const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  target: { type:String, enum:["ALL","PARENTS","TEACHERS"], default:"ALL" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true }
},{timestamps:true});
module.exports = mongoose.model("Announcement", schema);
