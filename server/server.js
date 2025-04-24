const express = require("express");
const app = express();
require("dotenv").config();  // Load environment variables
const connectDB = require("./config/dbConfig");  // Import DB config

app.use(express.json());
const port = process.env.PORT || 5000;

// Import routes
const usersRoute = require("./routes/usersRoute");
const projectsRoute = require("./routes/projectsRoute");
const tasksRoute = require("./routes/tasksRoute");
const notificationsRoute = require("./routes/notificationsRoute");

// Middleware and routes
app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/notifications", notificationsRoute);

const path = require("path");
__dirname = path.resolve();

// Connect to MongoDB before starting server
connectDB();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Start the server
app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
