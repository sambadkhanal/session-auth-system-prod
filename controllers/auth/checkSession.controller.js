const checkSessionController = (req, res) => {
  res.setHeader("Cache-Control", "no-store"); // Ensures the browser does not cache old session (Sometimes "GET /api/auth/checkSession" gives us cached session(previous one) rather than fresh session from server). In react js, when we are not authenticated session state in App.jsx ie userSession created via useState should be null but if previous session is used after /checkSession api call then react app thinks user is authenticated as it will get previous session

  if (!req.session.user) {
    // Browser sends session_id cookie
    // express-session uses that session_id to find the session in MongoStore
    // If no session exists or req.session.user is missing, user is not authenticated
    return res.status(401).json({ success: false, msng: "Unauthorized" });
  }

  res
    .status(200)
    .json({ success: true, msng: "Authorized", session: req.session.user });
};

export default checkSessionController;
