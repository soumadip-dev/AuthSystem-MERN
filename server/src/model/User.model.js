import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//* Schema definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      default: '',
    },
    verificationOtpExpiry: {
      type: Number,
      default: 0,
    },
    resetPasswordOtp: {
      type: String,
      default: '',
    },
    resetPasswordOtpExpiry: {
      type: Number,
      default: 0,
    },
    googleId: {
      type: String,
      default: '',
    },
    githubId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

//* Pre save hook to hash the password and convert email to lowercase
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.email = this.email.toLowerCase();
  next();
});

//* Create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

//* Export the model
export default User;
