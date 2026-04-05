const dotenv = require("dotenv");

dotenv.config();

const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbConnected = false;

module.exports = async (req, res) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server initialization failed.",
      error: error.message,
    });
  }
};
