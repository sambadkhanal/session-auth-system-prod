import User from "../../models/User.model.js";
import bcrypt from "bcrypt";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msng: "Name, email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, msng: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      msng: "User registered successfully",
    });
  } catch (err) {
    console.log("Error occured inside register controller: ", err.stack);
    res.status(500).json({
      success: false,
      msng: "Internal Server Error",
    });
  }
};

export default registerController;
