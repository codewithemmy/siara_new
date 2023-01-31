const User = require("../models/User");
const crypto = require("crypto");
const { mailTransport } = require("../utils/sendEmail");


//register user
const register = async (req, res) => {
  const { name, email, phonenumber } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(400).json({ msg: `email already exist` });
  }

  const user = await User.create({
    name,
    email,
    phonenumber,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Siara" <siara@gmail.com>', // sender address
    to: email, //receiver
    subject: "Welcome to SIARA", // Subject line
    html: `<h4> Hello ${name}, you can now reach out for emergency with ease. Login to your Siara Emergency App</h4>`, // html body
  });

  res.status(201).json({
    msg: "Account Successfully Created",
  });
};

//user login
const login = async (req, res) => {
  const { phonenumber } = req.body;

  if (!phonenumber) {
    return res.status(400).json({ msg: `please provide phone number` });
  }
  const user = await User.findOne({ phonenumber });

  if (!user) {
    return res.status(404).json({ msg: `phone number not found` });
  }

  const token = user.createJWT();

  res
    .status(200)
    .json({ msg: "Login Successful", userId: user._id, token: token });
};

const test = async (req, res) => {
  console.log(req.user);
  res.send("welcome");
};

//export modules
module.exports = {
  test,
  register,
  login,
};
