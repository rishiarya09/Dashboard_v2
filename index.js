const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

// server listening
server.listen(port, (err) => {
  console.log(`Server running on port ${port}`);
});
