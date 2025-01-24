const express = require(`express`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const path = require("path");
const cors = require(`cors`);
const authRoutes = require("./routes/auth.routes");
const workoutRoutes = require("./routes/workout.routes");
const goalRoutes = require("./routes/goal.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const app = express();

// Use CORS middleware to allow requests from specific origins
const allowedOrigins = [
  "http://localhost:3000", // Your local frontend origin
  "https://luminous-parfait-e2edae.netlify.app/",
  "https://fitness-app-blib.onrender.com/", // Your live frontend URL (Netlify)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

app.use(cors(corsOptions));

// app.use(express.json());
app.use(bodyParser.json());

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
  .connect(
    "mongodb+srv://nits000333:0KFToxEeJeYQToT4@backenddb.muafh.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backendDB"
  )
  .then(() => {
    console.log("Connected to database...");
    app.listen(3000, () => {
      console.log("server is running on port 3000....");
    });
  })
  .catch(() => {
    console.log("Connection failed!!!");
  });
