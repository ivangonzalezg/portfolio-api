/* eslint-disable no-console */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const fileupload = require("express-fileupload");
const fs = require("fs");
const http = require("http");
const https = require("https");
require("dotenv").config();

// routes
const formRoute = require("./server/v1/routes/form.route");

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("build"));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());

let database = { url: process.env.DB_REMOTE, server: "remote" };
if (process.argv[2] === "dev") database = { url: process.env.DB_LOCAL, server: "local" };

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`Connected to ${database.server} database`);
  });

// paths
app.use("/api/v1/form", formRoute);

app.get(/(^\/(?!public|api).*)/, (req, res) => res.sendFile(path.join(__dirname, "build/index.html")));

const privateKey = fs.readFileSync("./privkey.pem", "utf8");
const certificate = fs.readFileSync("./fullchain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpServer = http.createServer(app);

const httpsServer = https.createServer(credentials, app);

httpServer.listen(5000);

httpsServer.listen(5443);

console.log("Server listening on port 5000 and 5443");
