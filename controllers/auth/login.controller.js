import User from "../../models/User.model.js";
import bcrypt from "bcrypt";

const loginController = async (req, res) => {
  // email and password from user
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msng: "Email and password are required" });
  }

  // Do user exists via email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, msng: "User not found" });
  }

  //compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, msng: "Wrong password" });
  }

  req.session.userId = user._id;

  res.status(200).json({
    success: true,
    msng: "User logged in successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    sessionID: req.sessionID,
    session_object: JSON.stringify(req.session),
  });

  // Session auth via session ie "req.session" which is loggedIn user's session_object which will be stored in mongo's collection called session_store
  // req.session.regenerate((err) => {
  //   if (err) {
  //     return res.status(500).json({
  //       success: false,
  //       msng: "Error occured while regenerating sessions",
  //       error: err,
  //     });
  //   }

  //   req.session.loggedUserId = user._id;
  //   // It stores the logged-in user's MongoDB ID(_id) inside this session.
  //   // IMP: So future requests can identify who is logged in because once you logged in your _id will be stored in session in server ie req.session.loggedUserId  is not undefined
  //   // Now our session becomes like this -> req.session = {
  //   //   loggedUserId : "6852f0c123456789abcdef01",
  //   // };
  //   // express-session will generate the session_id and adds a Set-Cookie header to the http response
  //   // The browser sees Set-Cookie: session_id=abc123xyz and automatically stores it in its cookie jar
  //   // And in future requests browser automatically sends Cookie: session_id=abc123xyz which will be used to identify the session object or document in mongo's session_store collection that we created

  //   // Ensures session object ie req.session ie {cookie: {...}, loggedUserId: xxxxx} is stored in session_store BEFORE responding
  //   req.session.save((err) => {
  //     if (err) {
  //       return res.status(500).json({
  //         success: false,
  //         msng: "Failed to save session object in session store in mongo",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       msng: "User logged in successfully",
  //       data: {
  //         id: user._id,
  //         name: user.name,
  //         email: user.email,
  //       },
  //       sessionID: req.sessionID,
  //       session_object: JSON.stringify(req.session),
  //     });
  //   });
  // });
};

export default loginController;
