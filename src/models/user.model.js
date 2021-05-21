import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();

// const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    validate: [validator.isEmail, 'Pleas provide an email address'],
    lowercase: true,
    unique: true,
    required: [true, "Email can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 8 },
});

UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH));
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

UserSchema.statics.checkExistingField = async (field, value) => {
  return User.findOne({ [`${field}`]: value });
};
export const User = mongoose.model('User', UserSchema, 'users');
