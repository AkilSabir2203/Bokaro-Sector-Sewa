const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "akil@123";
    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log("Seed skipped: default admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("akil123", 10);

    await Admin.create({
      username: "akil-admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Default admin seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
