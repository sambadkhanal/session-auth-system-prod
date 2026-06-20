const logoutController = async (req, res) => {
  // ---------- Session auth logout ----------
  // req.session.destroy() deletes the session immediately from MongoStore ie session_store
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err.stack);
      return res
        .status(500)
        .json({ success: false, msng: "Failed to logout", error: err });
    }

    // Now delete cookie from browser
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
