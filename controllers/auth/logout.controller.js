const logoutController = async (req, res) => {
  // ---------- Session auth logout ----------
  // Lets remove user's session document or session object from mongo session_store collection
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msng: "Failed to logout", error: err });
    }

    // Session object or document is removed from MongoStore so now lets remove cookie from browser
    res.clearCookie("session_id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({ success: true, msng: "Logged out successfully" });
  });
};

export default logoutController;
