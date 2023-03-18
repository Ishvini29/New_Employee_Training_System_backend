const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    userRoleId: {type: mongoose.Schema.Types.ObjectId, ref: "UserRoleData"},
    empId: { type: String, required: true, default: "001A" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNumber: { type: Number, required: true },
    SubmittedOn: { type: String, default: Date.now },
    emailAddress: { type: String, required: true, unique: true },
    verified: { type: String, default: "false" },
    userStatus: { type: String, default: "active" },
    department: {type: mongoose.Schema.Types.ObjectId,ref: "DepartmentData",},
    jobPosition: {type: mongoose.Schema.Types.ObjectId,ref: "JobtitleData",},
    badges: [{badgeValue: { type: String },earnedOn: { type: Date },},],
    earnedScoresByQuiz: { numOfQuizzesDone: { type: Number },totalScoresEarned: { type: Number },},
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("UserData", User);
module.exports = model;
