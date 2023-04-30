const express = require("express");
const APIRouter = require("./Routes/APIRouter");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { dbAfter, dbBefore } = require("./Routes/debugger");
const app = express();
const PORT = 5003;
//const MONGODB_URI = "mongodb://127.0.0.1:27017/batch64edurekaapi";
const MONGODB_URI =
  "mongodb+srv://batch64:batch123@batch-64.9tbefxg.mongodb.net/batch64edurekaapi?retryWrites=true&w=majority";

app.use(cors()); // enable cors policy

app.use(morgan("tiny"));
// eligible to access post data
app.use(express.json()); // string data to json data
app.use(express.urlencoded({ extended: false })); //post

// add external routing to app js
// middleware
app.use("/", APIRouter);

// before starting server we need to check db connection
dbBefore("connecting to db");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    dbAfter("Db connected successfully");
    app.listen(PORT, function () {
      console.log("Server is running on port ", PORT);
    });
  })
  .catch((error) => {
    console.log("unable to connect with DB");
    console.log(error);
  });
