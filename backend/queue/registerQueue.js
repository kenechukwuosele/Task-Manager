const Queue = require("bull");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const registerQueue = new Queue("registerQueue", {
  redis: { host: "127.0.0.1", port: 6379 }
});

// Define how jobs are processed
registerQueue.process(async (job, done) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } = job.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name,
      email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl || null, // Set profile image URL if provided
      role: adminInviteToken ? "admin" : "user", // Assign role based on admin invite token     
    });

    await newUser.save();
    console.log("User created successfully:", newUser);

    done(null, { success: true, userId: newUser._id });
  } catch (err) {
    done(new Error(err.message));
  }
});

module.exports = registerQueue;
