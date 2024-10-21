require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
//packages
const cookieParser = require("cookie-parser");
//security
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
//db
const connectDb = require("./db/connectDb");
//middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
//routers
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const staffRouter = require("./routes/staffRoutes");
const trainerRouter = require("./routes/trainerRoutes");
//app
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send(
    "<h1>Gym Managment System Api</h1><a href='/api-docs'>Documentation</a>"
  );
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/trainer", trainerRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
