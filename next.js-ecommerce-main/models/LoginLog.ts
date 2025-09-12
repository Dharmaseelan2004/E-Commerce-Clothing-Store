import mongoose, { Schema, model, models } from "mongoose";

const loginLogSchema = new Schema({
  email: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

const LoginLog = models.LoginLog || model("LoginLog", loginLogSchema);
export default LoginLog;
