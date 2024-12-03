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

const db = admin.database();

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

app.post("/add-device", async (req, res) => {
  const { userId, deviceId } = req.body;

  if (!userId || !deviceId) {
    return res.status(400).json({ success: false, message: "Invalid request data." });
  }

  try {
    const devicesRef = db.ref("/devices");
    const snapshot = await devicesRef.orderByKey().equalTo(deviceId).once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: "Device ID not found." });
    }

    const deviceData = snapshot.val()[deviceId];

    if (deviceData.Claimed) {
      return res.status(400).json({ success: false, message: "Device is already claimed." });
    }

    // Update device ownership
    await devicesRef.child(deviceId).update({
      Owner: userId,
      Claimed: true,
    });

    // Fetch coordinates for the claimed device
    const coordinatesRef = db.ref("/coordinates");
    const coordSnapshot = await coordinatesRef.orderByChild("Module").equalTo(deviceData.Module).once("value");

    const coordinates = [];
    if (coordSnapshot.exists()) {
      coordSnapshot.forEach((child) => {
        coordinates.push(child.val());
      });
    }

    // Fetch the user's devices after the device is added
    const userDevicesRef = db.ref("/devices").orderByChild("Owner").equalTo(userId);
    const userDevicesSnapshot = await userDevicesRef.once("value");

    const devices = [];
    if (userDevicesSnapshot.exists()) {
      userDevicesSnapshot.forEach((childSnapshot) => {
        devices.push(childSnapshot.val());
      });
    }

    return res.json({
      success: true,
      message: "Device Successfully Added.",
      coordinates, // Include coordinates in the response
      devices, // Include updated devices for the user
    });
  } catch (error) {
    console.error("Error adding device:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post('/get-coordinates', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch devices from Firebase
    const devicesRef = db.ref('/devices'); // Reference to the 'devices' node
    const devicesSnapshot = await devicesRef.once('value'); // Get all data from 'devices'
    const devicesData = devicesSnapshot.val();

    if (!devicesData) {
      return res.status(404).json({ error: 'No devices found' });
    }

    // Filter devices for the logged-in user and create a lookup for their Color
    const ownedDevices = Object.values(devicesData).filter(
      (device) => device.Owner === userId && device.Claimed
    );

    const deviceColorMap = ownedDevices.reduce((map, device) => {
      map[device.Module] = device.Color || "defaultColor"; // Use a default color if none is set
      return map;
    }, {});

    // Fetch coordinates from Firebase
    const coordinatesRef = db.ref('/coordinates'); // Reference to the 'coordinates' node
    const coordinatesSnapshot = await coordinatesRef.once('value'); // Get all data from 'coordinates'
    const coordinatesData = coordinatesSnapshot.val();

    if (!coordinatesData) {
      return res.status(404).json({ error: 'No coordinates found' });
    }

    // Filter coordinates by owned modules
    const parsedCoordinates = Object.keys(coordinatesData)
      .map(id => ({
        Longitude: coordinatesData[id].Longitude,
        Latitude: coordinatesData[id].Latitude,
        Module: coordinatesData[id].Module,
        Timestamp: coordinatesData[id].Timestamp,
        Color: deviceColorMap[coordinatesData[id].Module] || "defaultColor", // Map the color
      }))
      .filter((coordinate) => ownedDevices.some((device) => device.Module === coordinate.Module));

    res.json(parsedCoordinates); // Send filtered coordinates back to frontend
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/get-devices", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid request data." });
  }

  try {
    const db = admin.database();
    const devicesRef = db.ref("/devices");
    const snapshot = await devicesRef.orderByChild("Owner").equalTo(userId).once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ success: true, devices: [], message: "No devices found for this user." });
    }

    const devices = [];
    snapshot.forEach((childSnapshot) => {
      devices.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    return res.json({ success: true, devices });
  } catch (error) {
    console.error("Error fetching devices:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post('/remove-device', async (req, res) => {
  const { userId, deviceId } = req.body;
  
  try {
    // Retrieve the device data from the database
    const deviceRef = db.ref(`/devices/${deviceId}`);
    const deviceSnapshot = await deviceRef.once('value');
    const deviceData = deviceSnapshot.val();

    if (!deviceData) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // Validate ownership
    if (deviceData.Owner !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    // Update the device properties
    await deviceRef.update({
      Claimed: false,
      Owner: null,
    });

    return res.status(200).json({ success: true, message: "Device successfully removed" });
  } catch (error) {
    console.error("Error removing device:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/update-device', async (req, res) => {
  const { userId, deviceId, newName, newColor } = req.body;

  if (!userId || !deviceId || !newName) {
      return res.status(400).json({ success: false, message: "Invalid input." });
  }

  try {
      const deviceRef = db.ref(`/devices/${deviceId}`);
      const snapshot = await deviceRef.once("value");

      if (!snapshot.exists()) {
          return res.status(404).json({ success: false, message: "Device not found." });
      }

      const deviceData = snapshot.val();

      // Validate ownership
      if (deviceData.Owner !== userId) {
          return res.status(403).json({ success: false, message: "Unauthorized action." });
      }

      // Update device name
      await deviceRef.update({ 
        Name: newName,
        Color: newColor,
      });

      return res.status(200).json({ success: true, message: "Device updated successfully." });
  } catch (error) {
      console.error("Error updating device:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Start server
app.listen(8800, () => {
  console.log("Connected to backend on port 8800");
});
