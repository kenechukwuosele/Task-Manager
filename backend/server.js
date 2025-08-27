require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const ReportRoutes = require("./routes/report.routes");

const app = express();

//Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET,POST,PUT,DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




//Connect DataBase
connectDB();


//Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




//Routes
app.use("/api/v1/auth", authRoutes);
app.use("api/v1/report",  ReportRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users",UserRoutes);

//Start Server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
