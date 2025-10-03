const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  date: {type: Date, required:true},
  task: {type:String, required:true}, // goûter, accueil, etc.
  capacity: {type:Number, default:1},
  signups: [{
    parent: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    note: String
  }]
},{timestamps:true});
module.exports = mongoose.model("PlanningSlot", schema);
