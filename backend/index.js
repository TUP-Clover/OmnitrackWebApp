import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import bcrypt from "bcrypt";
import session from "express-session";
import { readFile } from "fs/promises";

const app = express();

app.use(express.json()); 
app.use(
    cors({
      origin: "http://localhost:3000", // Your React app's URL
      methods: ["GET", "POST"],
      credentials: true, // Allow cookies to be sent
    })
  );

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  await readFile(new URL("./firebase-admin-key.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-c92e9-default-rtdb.firebaseio.com/",
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "This is the backend" });
});

// Session middleware
app.use(
    session({
      secret: "secret-key", 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // set to `true` if using https
    })
);

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    try {
      // Fetch user from Firebase using the username
      const db = admin.database();
      const usersRef = db.ref("/users");
      const snapshot = await usersRef.orderByChild("username").equalTo(username).once("value");
      
      if (!snapshot.exists()) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0]; // Get the unique Firebase key for the user
      const user = userData[userKey]; // Get the user data using the unique key
      
      // Compare passwords
     
      const hashedPassword = user.password.trim();
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Store user info in session
      req.session.user = {
        userId: userKey, // Use the Firebase unique ID as the userId
        username: user.username,
        email: user.email,
      };
  
      // Send response
      return res.json({
        userExists: true,
        message: "Login successful",
        user: {
          userId: userKey, // Include the Firebase unique ID in the response
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
});
  

// Start server
app.listen(8800, () => {
  console.log("Connected to backend on port 8800");
});
