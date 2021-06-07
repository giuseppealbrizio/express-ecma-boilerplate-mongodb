import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';
import crypto from 'crypto';

dotenv.config();

// const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    validate: [validator.isEmail, 'Please provide an email address'],
    lowercase: true,
    unique: true,
    required: [true, "Email can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 8 },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.HASH, 10),
  );
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign({ id: this._id }, 'JWT_SECRET', {
    expiresIn: '10d',
    // algorithm: 'RS256',
  });
};

UserSchema.methods.generatePasswordResetToken = async function () {
  this.resetPasswordToken = await crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

UserSchema.statics.checkExistingField = async function (field, value) {
  const user = this;

  return user.findOne({ [`${field}`]: value });
};

export default mongoose.model('User', UserSchema, 'users');
