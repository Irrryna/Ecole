const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: String,
  content: String,
  published: {type:Boolean, default:false},
  author: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true }
},{timestamps:true});
module.exports = mongoose.model("Post", schema);
