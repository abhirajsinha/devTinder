const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose.connect(
    "mongodb+srv://abhirajsinha25:asmongodb@cluster0.7dglxng.mongodb.net/socialpedia"
  );
}

module.exports = connectToDatabase;
