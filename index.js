// import express from "express";
// import "dotenv/config";
// import bodyParser from "body-parser";
// import path from "path";
// import cors from "cors";
// import route from "./routes/index.js";
// import sequelize from "./config/db.js";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();

// app.use(
//     cors({
//         origin: true,
//         credentials: true,
//         preflightContinue: false,
//         methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//     })
// );
// app.use("/assets", express.static(path.join(__dirname, "assets")));

// app.options("*", cors());

// app.get("/", function (req, res) {
//     res.send("Hello World!");
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(route);

// app.listen(3000, () => {
//     console.log(`Example app listening on port ${3000}`);
// });

import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import route from "./routes/index.js";
import sequelize from "./config/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  })
);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.options("*", cors());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Body Parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use(route);

// Synchronize database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to synchronize the database:", err);
  });

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
