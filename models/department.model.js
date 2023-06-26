const mongoose = require("mongoose");
const { Schema } = mongoose;
const Department = new mongoose.Schema(
  {
    depName: { type: String, unique: true },
    createdOn: { type: Date, default: Date.now },
    Jobtitle: [
      {
        jobTitlename: { type: String },
        createdOn: { type: Date, default: Date.now },
        chaptersAllocated: [
          { type: Schema.Types.ObjectId, ref: "ChapterData" },
        ],
        reasons: [{ type: Object }],
      },
    ],
    reasons: [{ type: Object }],
    leaderboardCount: { type: Number, default: 0 },
  },
  {
    collection: "departments",
  }
);
const model = mongoose.model("DepartmentData", Department);  //create a model named "DepartmentData" based on the "Department" schema.
module.exports = model;
