var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const port = process.env.PORT || "5000";

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", () => {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});
