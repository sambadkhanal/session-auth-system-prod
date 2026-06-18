const auth = (req, res, next) => {
  if (!req.session.loggedUserId) {
    return res.status(401).json({
      success: false,
      msng: "Not authorized",
      data: { "req.sessionID": req.sessionID, "req.session": req.session },
    });
  }
  next();
};

export default auth;
