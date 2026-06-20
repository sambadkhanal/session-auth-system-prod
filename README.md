# session_auth_system

A backend API for session-based authentication using **Express**, **express-session**, and **connect-mongo** for persistent session storage in MongoDB.

This project demonstrates secure session authentication with cross-origin cookie handling for frontend-backend communication.

---

# 🧠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- express-session
- connect-mongo
- bcrypt
- cors
- dotenv

---

# 🔐 Authentication System

This project uses **session-based authentication**:

- User logs in successfully
- Server creates a session and stores it in MongoDB (via `connect-mongo`)
- Browser receives a session cookie (`session_id` -> custom or `connect.sid` -> default)
- Cookie is used automatically on future requests
- Server validates session from MongoDB store via session_id cookie sent automatically from browser

---

# 🍪 Cross-Origin Cookie Sharing (IMPORTANT)

Session cookies must be properly configured for cross-origin requests.

## Production requirement:

```js
cookie: {
  httpOnly: true,
  secure: true,
  sameSite: "none"
}
```
