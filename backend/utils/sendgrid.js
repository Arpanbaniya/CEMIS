const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send email for account verification
const sendVerificationEmail = async (email) => {
  const verificationUrl = `http://localhost:5000/api/users/verify/${email}`;
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Verify your email address",
    text: `Click the link below to verify your email: ${verificationUrl}`,
    html: `<p>Click the link below to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};

// Send email for event registration confirmation
const sendRegistrationEmail = async (email, eventName) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: `Registration Confirmation for ${eventName}`,
    text: `You have successfully registered for ${eventName}.`,
    html: `<p>You have successfully registered for <strong>${eventName}</strong>.</p>`,
  };

  await sgMail.send(msg);

  try {
    await sgMail.send(msg);
    console.log(`Registration confirmation email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email.");
  }
};

module.exports = { sendVerificationEmail, sendRegistrationEmail };
