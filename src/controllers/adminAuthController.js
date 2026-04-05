const { signupAdmin, loginAdmin } = require("./adminController");

const registerAdmin = async (req, res) => {
  const { setupKey, name, username, email, password, role } = req.body;

  if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid setup key.",
    });
  }

  req.body = {
    username: username || name,
    email,
    password,
    role,
  };

  return signupAdmin(req, res);
};

const getAdminProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.admin,
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
