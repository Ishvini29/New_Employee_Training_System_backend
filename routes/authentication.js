const express = require("express");
const authenticationRoutes = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
require("dotenv").config();
const User = require("../models/user.model");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const UserRole = require("../models/userRole.model")

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

authenticationRoutes.route("/authentication/login").post(async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({ message: "Login failed", status: false });
      }
      const profile = verificationResponse?.payload;

      const userDocument = await User.findOne({ emailAddress: profile?.email });
      if (userDocument) {
        if (userDocument.verified === true) {
          res.status(200).json({
            message: "Success",
            user: {
              picture: profile?.picture,
              token: jwt.sign({ userData: userDocument }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXP,
              }),
            },
            availability: true,
            verified: true,
            status: true
          });
        } else {
          res.status(200).json({
            message: "Not Verified",
            user: {
              firstName: profile?.given_name,
              lastName: profile?.family_name,
            },
            availability: true,
            verified: false,
            status: true
          });
        }
      } else {
        res.status(200).json({
          message: "New User",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
          },
          availability: false,
          verified: false,
          status: true
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Back end Error",
      status: false
    });
  }
});


authenticationRoutes.route("/authentication/addFurtherDetails").post(async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const gender = req.body.gender;
  const dob = req.body.dob;
  const phoneNumber = req.body.phone;
  const emailAddress = req.body.email;
  const department = req.body.department;
  const jobPosition = req.body.jobTitle;
  const userImage = req.body.userImage;
  const empId = req.body.employeeID;
  let verified = false;
  const usrCount = await User.find().lean();
  let userRole = "";
  if (usrCount.length === 0) {
    userRole = "Super Admin"
    verified = true;
  } else {
    userRole = "Hired Employee"
  }

  const user = new User({
    firstName, lastName, gender, dob, phoneNumber, empId,
    emailAddress, department, jobPosition, userRole, userImage, verified
  })

  user.save()
    .then(item => res.json({ message: "Further Details Added Successfully", status: "success" }))
    .catch(err => {
      if (err.code === 11000) {
        return res.json({ message: 'User already exists', status: "duplicate" });
      }
      console.log(err);
      console.log(err)
      res.status(500).send({ error: 'Error saving data to the database' });
    });
});

authenticationRoutes.route("/authentication/verifyToken/:token").get(async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.json({
        message: "Token is Invalid or Expired",
        status: false,
        expTime: process.env.JWT_EXP,
      });
    } else {
      return res.json({
        // message: decoded,
        status: true,
        expTime: process.env.JWT_EXP,
      });
    }
  });
});


// testing only

authenticationRoutes.route("/testing").get(async (req, res) => {
  const userDocument = await User.findOne({ emailAddress: "ragurajsivanantham@gmail.com" });
  console.log(userDocument)
  if (userDocument === null) {
    res.json({ "message": "User Not Found" })
  } else {
    res.json({ "message": userDocument })
  }

});


//backup

authenticationRoutes.route("/authentication/loginbackup").post(async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({ message: verificationResponse.error }); // this is only for testing purpose
        // return res.status(400).json({ message: "Login failed" }); // This is the original code
      }
      const profile = verificationResponse?.payload;

      const userDocument = await User.findOne({ emailAddress: profile?.email });
      if (userDocument) {
        res.status(200).json({
          message: "Login was successfull",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            userRole: userDocument.userRole,
            token: jwt.sign({ userData: userDocument }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXP,
            }),
          },
          status: true
        });
      } else {
        res.status(200).json({
          message: "Please add your further details to continue !",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
          },
          status: false
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

module.exports = authenticationRoutes;
