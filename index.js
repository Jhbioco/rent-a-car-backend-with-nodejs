const express = require("express");
const app = express();
const mongoose = require("mongoose");
const user = require("./routes/user");
const category = require("./routes/category");
const car = require("./routes/car");
const rental = require("./routes/rental");

app.use(express.json());

//Connect to MongoDB
mongoose
  .connect("mongodb://localhost/car-rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connecting to MongoDB"))
  .catch(error => console.error("Could not connect to mongoDB ", error));

app.use("/api/rentals/user", user);
app.use("/api/rentals/category", category);
app.use("/api/rentals/car", car);
app.use("/api/rentals/rental", rental);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Connecting on port", port));
