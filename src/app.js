const express = require("express");
const connectToDatabase = require("./config/databases");
const app = express();

connectToDatabase()
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("Server is listening on port: " + 3000);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log(err);
  });
