const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, "please provide name."],
        trim: true,
        maxlength: 20,
        minlength: 5,
      },
      email: {
        type: String,
        required: [true, "please provide email."],
        trim: true,
        validate: {
          validator: validator.isEmail,
          message: "Please provide a valid email address.",
        },
        unique: true,
      },
      password: {
        type: String,
        required: [true, "please provide password."],
        select: false,
        minlength: 6,
      },
    },
    { timestamps: true }
  );
  //hash the password before create the instance
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  //after creating the instance in the server
  //method for create a JSON web Token
  userSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };
  //compare password
  userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  };
  //create a user model using userSchema and export
  const User = mongoose.model("User", userSchema);
  module.exports = User;