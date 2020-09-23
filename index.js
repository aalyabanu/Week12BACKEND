const express = require("express");
const mongoose = require("mongoose"); //to connect DB with mongoose
const cors = require("cors");
require("dotenv").config();

//set up express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

//set up mongoose (mongoose connects to mongodb)

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// //set up routes
app.use("/users", require("./routes/userRouter"));
app.use("/events", require("./routes/eventRouter"));
