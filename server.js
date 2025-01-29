require("dotenv").config();
const express = require(`express`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const rateLimit = require(`express-rate-limit`);
const path = require("path");
const cors = require(`cors`);
const authRoutes = require("./routes/auth.routes");
const workoutRoutes = require("./routes/workout.routes");
const goalRoutes = require("./routes/goal.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const app = express();

// Use CORS middleware to allow requests from specific origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://fitness-app1581.netlify.app",
  "https://fitness-app-blib.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Rate limit rule
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 10 request per ip
  message: "Too many requests from this IP, please try again after an hour",
});

app.use("/api/", apiLimiter);

app.get("/", (req, res) => {
  res.send("hello form node-api");
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// getting routes
app.use("/api", authRoutes);
app.use("/api/workoutS", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database...");
    app.listen(3000, () => {
      console.log("server is running on port 3000....");
    });
  })
  .catch(() => {
    console.log("Connection failed!!!");
  });
