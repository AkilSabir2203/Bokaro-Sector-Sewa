const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured in environment variables.");
    }

    // Atlas SRV lookups can fail on some local DNS resolvers, so use stable public DNS.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
