require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

//connect to db
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRouter");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// app.use(helmet());
app.use(cors());
// app.use(xss());

app.get("/", (req, res) => {
  res.send(
    '<h1>Siara App</h1><a href="https://documenter.getpostman.com/view/23195379/2s935it5qy">Documentation</a>'
  );
});

// routes
app.use("/api/v1", authRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

mongoose.set("strictQuery", true);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
