const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is available in the environment variables
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);  // Exit the process if connection fails
  }
};

module.exports = connectDB;
