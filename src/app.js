const express = require("express");
const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Hanling Middlewares");
    res.send("hello world");
    next()
  },
  (req, res, next) => {
    console.log("Handling Middlewares 2");
    res.send('2nd Middleware')    
  }
);

app.listen(3000, () => {
  console.log("Server is listening on port: " + 3000);
});
