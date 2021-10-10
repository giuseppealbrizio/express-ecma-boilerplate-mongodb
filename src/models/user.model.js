import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';
import crypto from 'crypto';
import { roles } from '../config/roles.config';
import { ApplicationError } from '../helpers/errors.helper';

dotenv.config();

// const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

if (!process.env.JWT_KEY) {
  throw new ApplicationError(
    404,
    'Please provide a JWT_KEY as global environment variable',
  );
}
const jwtKey = process.env.JWT_KEY;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Must be a Valid email',
    },
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
  google: {
    id: String,
    sync: { type: Boolean }, // authorisation to sync with google
    tokens: {
      accessToken: String,
      refreshToken: String,
    },
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
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

  userObj.id = userObj._id; // remap _id to id
  delete userObj._id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    jwtKey,
    {
      expiresIn: '10d',
      // algorithm: 'RS256', // use this if set public and private keys
    },
  );
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
