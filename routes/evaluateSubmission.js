const express = require("express");
const evaluateSubmission = express.Router();

const Users = require("../models/user.model");
const FinalProjectAssignments = require("../models/finalProjectAssignment.model");

evaluateSubmission.post("/toEvaluateSubmission", async (req, res) => {
  const { empId, score, feedback, show } = req.body;
  let users = await Users.findOne({ empId });
  await FinalProjectAssignments.updateOne(
    { userId: users._id, status: true },
    { status: false },
    { new: true }
  );
  let data = {
    projectScore: score,
    feedback: feedback,
    status: true,
    show: show,
    gradedOn: Date.now(),
  };
  //find and update
  let updated = await FinalProjectAssignments.updateOne(
    {
      userId: users._id,
      status: false,
    },
    data
  );
  // sending updating status to forntend
  if (updated.modifiedCount === 1) res.json(true);
  else res.json(false);
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
      projectScore: finalProj.projectScore,
      feedback: finalProj.feedback,
      show: finalProj.show,
    };
    res.json(evaluatedFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = evaluateSubmission;
