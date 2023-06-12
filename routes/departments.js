const express = require("express");
const departmentRoutes = express.Router();
const Department = require("../models/department.model");
//----------------------------------------------------------------------------------------------
departmentRoutes.route("/departments").get(function (req, res) {
  res.json([
    {
      url: "http://localhost:1337/departments/showAllDepartments",
      method: "get",
      desc: "Shows all department's data from database",
    },
  ]);
});
//---------------------------------------------------------------------------------------------
// Define a route for showing all departments
departmentRoutes.route("/departments/showAllDepartments").get(function (req, res) {
  try {
    Department.find({}, (err, departments) => {   // Find all departments in the database
      if (err) {  // If there's an error, send an error response
        res.send(err);
      } else {  // If there are no errors, send the departments as a response
        res.json(departments);
      }
    });
  } catch(err){
    console.log(err);
    res.json({status:false, message:"Backend Error"});
  }
  
});
//----------------------------------------------------------------------------------------------
// Define a route for checking if a department is available
departmentRoutes
  .route("/departments/isDepartmentAvailable")
  .post(function (req, res) {
    const depName = req.body.depName;   // Get the department name from the request body
    Department.findOne({ departmentname: depName }, (err, departments) => {  // Find a department with the given name in the database
      if (err) {   // If there's an error, send an error response
        console.log(err);
        res.send(err);
      } else {
        if (departments) {   // If the department exists, send a true status response
          res.json({ status: true });
          console.log(true);
        } else {   // If the department does not exist, send a false status response
          res.json({ status: false });
          console.log(false);
        }
      }
    });
  });
//------------------------------------------------------------------------------------------------
// Define a route for adding a department
departmentRoutes.route("/departments/addDepartment").post(async (req, res) => {
  const depName = req.body.departmentName;
  const createdOn = Date.now();
  console.log(depName);
  const departmentDetails = new Department({    // Create a new department object
    depName,
    createdOn,
  });
  // Save the new department to the database
  departmentDetails.save()
    .then((item) =>
      res.json({
        message: "Department Added Successfully",
        status: true,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res.json({
          message: "Department already exists",
          status: false,
        });
      }
      console.log(err)
      res.status(500).send({ error: err });
    });
});
//--------------------------------------------------------------------------------------------
// Define a route for editing a department
departmentRoutes.route("/departments/editDepartment").post(async (req, res) => {
  newName = req.body.newName;   // Get the new name for the department from the request body
  reason = req.body.reason;
  editedId = req.body.editedId;
  fromName = req.body.fromName;
  const newReasonObject = {   // Create a new reason object for the change
    reasonID: Math.floor(Date.now()) / 1000,
    reasonValue: reason,
    fromName: fromName,
    toName: newName,
  };
  try {
    const document = await Department.findById(editedId);  // Find the department being edited in the database
    document.reasons.push(newReasonObject);
    Department.updateOne(
      { _id: editedId },  //update the id as edited id for the perticular department
      { $set: { depName: newName, reasons: document.reasons } }   //update the depName as newName and update the reason object for the particular department
    )
      .then((result) => {
        return res.json({
          message: "Department Name Updated Successfully",
          status: true,
        });
      })
      .catch((err) => {
        return res.json({
          message: "Error in Updating Department Name",
          status: false,
        });
      });
  } catch {
    return res.json({
      message: "Department Not Found. Try Again !!!",
      status: false,
    });
  }

});
//-----------------------------------------------------------------------------------------------
departmentRoutes
  .route("/departments/deleteDepartment")
  .post(async (req, res) => {
    id = req.body.id;
    try {
      const deletedDepartment = await Department.deleteOne({ _id: id });
      return res.json({
        message: "Department Deleted Successfully",
        status: true,
      });
    } catch (error) {
      return res.json({
        message: "Error...!",
        status: false,
      });
    }
  });

//--------------------------------------------------------------------------

module.exports = departmentRoutes;
