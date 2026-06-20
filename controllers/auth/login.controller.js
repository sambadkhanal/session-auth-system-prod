import User from "../../models/User.model.js";
import bcrypt from "bcrypt";

const loginController = async (req, res) => {
  try {
    // email and password from user
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msng: "Email and password are required" });
    }

    // Do user exists: checking via email since email is unique and we don't get id from user to use findById()
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msng: "User not found" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msng: "Wrong password" });
    }

    // // ---------- Session auth login ----------
    // req.session.regenerate() is used to prevent session fixation attack
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msng: "Failed while creating session",
        });
      }

      // Session object called user is created
      // ---------- This is the main logic behind creating a session and thats it ----------
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      // req.session.save() this just guarantees the session is stored before sending the response.
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msng: "Failed while storing session",
          });
        }

        res.status(200).json({
          success: true,
          msng: "User is logged in successfully",
          session: req.session.user,
        });
      });
    });
  } catch (err) {
    console.log("Error occured inside login controller: ", err.stack);
    res.status(500).json({
      success: false,
      msng: "Internal Server Error",
    });
  }
};

export default loginController;
