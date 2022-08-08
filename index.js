const http = require("http");
const app = require("./app");

const { PORT } = process.env;
const port = PORT
const server = http.createServer(app).listen(PORT,'localhost');