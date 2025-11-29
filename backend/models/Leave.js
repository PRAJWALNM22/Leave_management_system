const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  leaveType: String,
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: {type:String, enum:['pending','approved','rejected'], default:'pending'},
  managerComment: String,
  createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model('Leave', leaveSchema);
