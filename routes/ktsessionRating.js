const express = require("express");
const KtSession = express.Router();

const KtSessions = require("../models/ktSession.model");
const Users = require("../models/user.model");

KtSession.get("/ktsessionRatings/:empId", async (req, res) => {
  let reqEmpId = req.params.empId;
  let [{ _id }] = await Users.find({ empId: reqEmpId }).select({ _id: 1 });
  let ktSessionRatings = await KtSessions.find({ createdBy: _id });

  let overAllRating = 0;
  let overAllQuality = 0;
  let overAllComm = 0;
  let overAllClarity = 0;
  let overAllKnowledgeAndSkill = 0;

  //data to progress bar
  let overAllRatingData = [];
  let overAllQualityData = [];
  let overAllCommData = [];
  let overAllClarityData = [];
  let overAllKnowledgeAndSkillData = [];

  for (let ratings of ktSessionRatings) {
    //data to progress bar
    overAllRatingData.push(ratings.overallRating);
    overAllQualityData.push(ratings.overallQuality);
    overAllCommData.push(ratings.overallComm);
    overAllClarityData.push(ratings.overallClarity);
    overAllKnowledgeAndSkillData.push(ratings.overallKnowledgeAndSkill);

    //storing overAllRating
    overAllRating += ratings.overallRating;
    overAllQuality += ratings.overallQuality;
    overAllComm += ratings.overallComm;
    overAllClarity += ratings.overallClarity;
    overAllKnowledgeAndSkill += ratings.overallKnowledgeAndSkill;
  }

  //progressbar data calculation
  const individualRates = (overAllRatingData) => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    overAllRatingData.map((data) =>
      data === 1
        ? count1++
        : data === 2
        ? count2++
        : data === 3
        ? count3++
        : data === 4
        ? count4++
        : count5++
    );
    let totalCount = count1 + count2 + count3 + count4 + count5;
    overAllRatingData = [
      parseFloat(((count1 / totalCount) * 100).toFixed(2)),
      parseFloat(((count2 / totalCount) * 100).toFixed(2)),
      parseFloat(((count3 / totalCount) * 100).toFixed(2)),
      parseFloat(((count4 / totalCount) * 100).toFixed(2)),
      parseFloat(((count5 / totalCount) * 100).toFixed(2)),
    ];

    return overAllRatingData;
  };

  overAllRatingData = individualRates(overAllRatingData);
  overAllQualityData = individualRates(overAllQualityData);
  overAllCommData = individualRates(overAllCommData);
  overAllClarityData = individualRates(overAllClarityData);
  overAllKnowledgeAndSkillData = individualRates(overAllKnowledgeAndSkillData);

  //rating
  let finalOverAllRating = (overAllRating / ktSessionRatings.length).toFixed(1);
  let finalOverAllQuality = (overAllQuality / ktSessionRatings.length).toFixed(
    1
  );
  let finalOverAllComm = (overAllComm / ktSessionRatings.length).toFixed(1);
  let finalOverAllClarity = (overAllClarity / ktSessionRatings.length).toFixed(
    1
  );
  let finalOverAllKnowledgeAndSkill = (
    overAllKnowledgeAndSkill / ktSessionRatings.length
  ).toFixed(1);

  let ratingData = [
    overAllQualityData,
    overAllCommData,
    overAllClarityData,
    overAllKnowledgeAndSkillData,
  ];

  let ktSessionRatingsData = {
    finalOverAllRating,
    finalOverAllQuality,
    finalOverAllComm,
    finalOverAllClarity,
    finalOverAllKnowledgeAndSkill,
    numOfKtSessions: ktSessionRatings.length,
    overAllRatingData,
    ratingData,
  };
  res.json(ktSessionRatingsData);
});

KtSession.route("/save-kt-ratings/:ktId").post(async (req, res) => {
  try {
    const ktId = req.params.ktId;
    const kt = await KtSessions.findById(ktId);

    kt.ratings.push(req.body);
    kt.save();

    const newKT = await KtSessions.findById(ktId).lean();
    let qualityRateSum = 0;
    let commRateSum = 0;
    let clarityRateSum = 0;
    let knowledgeAndSkillRateSum = 0;

    let overallQualityRate = 0;
    let overallCommRate = 0;
    let overallClarityRate = 0;
    let overallKnowledgeAndSkillRate = 0;
    let overallRate = 0;

    let ratingCount = newKT.ratings.length;

    newKT.ratings.forEach((rating) => {
      qualityRateSum += rating.qualityRate;
      commRateSum += rating.commRate;
      clarityRateSum += rating.clarityRate;
      knowledgeAndSkillRateSum += rating.knowledgeAndSkillRate;
    });

    overallQualityRate = Math.floor(qualityRateSum / ratingCount);
    overallCommRate = Math.floor(commRateSum / ratingCount);
    overallClarityRate = Math.floor(clarityRateSum / ratingCount);
    overallKnowledgeAndSkillRate = Math.floor(
      knowledgeAndSkillRateSum / ratingCount
    );

    overallRate = Math.floor(
      (qualityRateSum +
        commRateSum +
        clarityRateSum +
        knowledgeAndSkillRateSum) /
        (ratingCount * 4)
    );

    const updateKT = await KtSessions.findByIdAndUpdate(ktId, {
      overallRating: overallRate,
      overallQuality: overallQualityRate,
      overallComm: overallCommRate,
      overallClarity: overallClarityRate,
      overallKnowledgeAndSkill: overallKnowledgeAndSkillRate,
    });

    res.status(200).json({
      message: "Your request is successful",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Your request is unsuccessful", error: err });
  }
});

KtSession.get("/get-kt-ratings/:ktId", async (req, res) => {
  const ktId = req.params.ktId;
  KtSessions.findById(ktId, (err, kt) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(kt.overallRating);
    }
  });
});

module.exports = KtSession;
