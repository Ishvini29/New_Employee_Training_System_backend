const express = require("express");
const evaluateSubmission = express.Router();

const Users = require("../models/user.model");
const FinalProjectAssignments = require("../models/finalProjectAssignment.model");

evaluateSubmission.post("/toEvaluateSubmission", async (req, res) => {
  try {
    const { empId, score, feedback, show, gradedBy } = req.body;
    const users = await Users.findOne({ empId });
    //if user is not found
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    await FinalProjectAssignments.updateOne(
      { userId: users?._id, status: true },
      { status: false }
    );
    // if submission is not found
    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    let data = {
      projectScore: score,
      feedback: feedback,
      status: true,
      show: show,
      gradedOn: Date.now(),
      gradedBy,
    };
    //find and update
    let updated = await FinalProjectAssignments.updateOne(
      {
        userId: users?._id,
        status: false,
      },
      data
    );
    // sending updating status to forntend
    if (updated?.modifiedCount === 1) res.json(true);
    else res.json(false);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

evaluateSubmission.get("/getEvaluatedFeedback/:empId", async (req, res) => {
  try {
    let empId = req.params.empId;
    let user = await Users.findOne({ empId: empId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let [finalProj] = await FinalProjectAssignments.find({ userId: user._id });
    if (!finalProj) {
      return res
        .status(404)
        .json({ error: "Final project assignment not found" });
    }
    let evaluatedFeedback = {
      projectScore: finalProj?.projectScore,
      feedback: finalProj?.feedback,
      show: finalProj?.show,
      userImage: user?.userImage,
    };
    res.json(evaluatedFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = evaluateSubmission;
