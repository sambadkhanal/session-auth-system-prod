const auth = (req, res, next) => {
  if (!req.session.user) {
    // Browser sends session_id cookie
    // express-session uses that session_id to find the session in MongoStore
    // If no session exists or req.session.user is missing, user is not authenticated
    return res.status(401).json({
      success: false,
      msng: "Not authorized",
    });
  }
  next();
};

export default auth;
