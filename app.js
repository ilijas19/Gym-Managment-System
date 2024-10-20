require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
//packages
const cookieParser = require("cookie-parser");
//db
const connectDb = require("./db/connectDb");
//middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
//routers
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
//app
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

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
