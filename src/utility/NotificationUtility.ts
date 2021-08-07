// Email

import { ACCOUNT_SID, AUTH_TOKEN, FROM } from "../config";

// notifications

// OTP
export const GenerateOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, to: string) => {
  const accountSid = ACCOUNT_SID,
    authToken = AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  const response = await client.messages.create({
    body: `Your otp is ${otp}`,
    to: `+91${to}`,
    from: FROM,
  });

  return response;
};

// payment notificaitons and emails
