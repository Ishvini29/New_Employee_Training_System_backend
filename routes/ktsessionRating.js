const express = require("express");
const KtSession = express.Router();

const KtSessions = require("../models/ktSession.model");
const Users = require("../models/user.model");

KtSession.get("/ktsessionRatings/:empId", async (req, res) => {
  try {
    let reqEmpId = req.params.empId;
    let [user] = await Users.find({ empId: reqEmpId });
    // if user is not found
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found in the KT session section" });
    }
    //add user details
    const userData = {
      empId: user?.empId,
      userImage: user?.userImage,
      empName: user?.firstName + " " + user?.lastName,
    };

    let ktSessionRatings = await KtSessions.find({ createdBy: user?._id });
    let ktSessionRatingsData = {};
    let sessionData = [];

    if (ktSessionRatings?.length > 0) {
      // data for overall ratings
      let overAllRating = 0;
      let overAllQuality = 0;
      let overAllComm = 0;
      let overAllClarity = 0;
      let overAllKnowledgeAndSkill = 0;

      //data to progress bar
      let overAllQualityData = [];
      let overAllCommData = [];
      let overAllClarityData = [];
      let overAllKnowledgeAndSkillData = [];

      for (let ratings of ktSessionRatings) {
        let session = {
          sessionName: ratings?.sessionName,
          overallRating: ratings?.overallRating,
        };
        sessionData.push(session);
        //data to progress bar
        overAllQualityData.push(ratings?.overallQuality);
        overAllCommData.push(ratings?.overallComm);
        overAllClarityData.push(ratings?.overallClarity);
        overAllKnowledgeAndSkillData.push(ratings?.overallKnowledgeAndSkill);

        //storing overAllRating
        overAllRating += ratings?.overallRating;
        overAllQuality += ratings?.overallQuality;
        overAllComm += ratings?.overallComm;
        overAllClarity += ratings?.overallClarity;
        overAllKnowledgeAndSkill += ratings?.overallKnowledgeAndSkill;
      }

      //progressbar data calculation
      const individualRates = (overAllRatingData) => {
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        let count5 = 0;
        // count  the stars individually like 1 stars,2 stars,3 stars,4 stars,5 stars
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

      //call individualRates to count  the stars individually like 1 stars,2 stars,3 stars,4 stars,5 stars
      overAllQualityData = individualRates(overAllQualityData);
      overAllCommData = individualRates(overAllCommData);
      overAllClarityData = individualRates(overAllClarityData);
      overAllKnowledgeAndSkillData = individualRates(
        overAllKnowledgeAndSkillData
      );

      //rating
      let finalOverAllRating = (
        overAllRating / ktSessionRatings?.length
      ).toFixed(1);
      let finalOverAllQuality = (
        overAllQuality / ktSessionRatings?.length
      ).toFixed(1);
      let finalOverAllComm = (overAllComm / ktSessionRatings?.length).toFixed(
        1
      );
      let finalOverAllClarity = (
        overAllClarity / ktSessionRatings?.length
      ).toFixed(1);
      let finalOverAllKnowledgeAndSkill = (
        overAllKnowledgeAndSkill / ktSessionRatings?.length
      ).toFixed(1);

      //data for progress bar
      let ratingData = [
        overAllQualityData,
        overAllCommData,
        overAllClarityData,
        overAllKnowledgeAndSkillData,
      ];
      ktSessionRatingsData = {
        sessionData,
        userData,
        finalOverAllRating,
        finalOverAllQuality,
        finalOverAllComm,
        finalOverAllClarity,
        finalOverAllKnowledgeAndSkill,
        numOfKtSessions: ktSessionRatings?.length,
        ratingData,
      };
    }
    res.json(ktSessionRatingsData);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = KtSession;
