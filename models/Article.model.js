const mongoose = require("mongoose");
const Article = new mongoose.Schema(
  {
    articleName: { type: String },
    articleDesc: { type: String },
    overallRating: { type: Number, default: 0 },
    overallQuality: { type: Number, default: 0 },
    overallComm: { type: Number, default: 0 },
    overallClarity: { type: Number, default: 0 },
    overallKnowledgeAndSkill: { type: Number, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: "UserData" },
    ratings: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: "UserData" },
        ratedOn: { type: Date, default: Date.now() },
        qualityRate: { type: Number },
        commRate: { type: Number },
        clarityRate: { type: Number },
        knowledgeAndSkillRate: { type: Number },
      },
    ],
    comments: [
      {
        addedBy: { type: mongoose.Types.ObjectId, ref: "UserData" },
        comment: { type: String },
        commentedOn: { type: Date, default: Date.now() },
        replies: [
          {
            addedBy: { type: mongoose.Types.ObjectId, ref: "UserData" },
            reply: { type: String },
            repliedOn: { type: Date, default: Date.now() },
          },
        ],
      },
    ],
  },
  {
    collection: "articles",
  }
);
const model = mongoose.model(" ArticleData", Article);
module.exports = model;
