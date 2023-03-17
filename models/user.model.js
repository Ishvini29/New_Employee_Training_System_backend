<<<<<<< HEAD
const mongoose = require('mongoose');
const User = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        emailAddress: { type: String, required: true, unique: true},
        department: { type: String, required: true },
        userRole: { type: String, required: true, default:"Hired Employee" },
        jobPosition: { type: String, required: true },
        verified: { type: String,  default:"false"},
        userStatus: { type: String,  default:"active" },
        SubmittedOn: { type: String,  default:Date.now},
    },
    {
        collection: "users"
    }
)
const model = mongoose.model('UserData', User);
module.exports = model;
=======
const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    userRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userRoleData",
      required: true,
    },
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
    jobPosition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentData",
    },
    badges: [
      {
        badgeValue: { type: String },
        earnedOn: { type: Date },
      },
    ],
    earnedScoresByQuiz: {
      numOfQuizzesDone: { type: Number },
      totalScoresEarned: { type: Number },
    },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("UserData", User);
module.exports = model;
>>>>>>> sagini
