// packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// imports
const authRouter = require("./routers/auth");
const homeRouter = require("./routers/home");
const userRouter = require("./routers/user");
const portfoiloRouter = require("./routers/portfolio");
const dataRouter = require("./routers/data");
const authJwt = require("./middlewares/jwt");
const topSearch = require("./middlewares/topSearch");

// init
const app = express();
const port = process.env.PORT;
const url = process.env.API_URL;

// middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(`${url}/images`, express.static(path.join(__dirname, "images")));
app.use(`${url}/uploads`, express.static(path.join(__dirname, "uploads")));
// app.use(authJwt);
app.use(topSearch);

// routers
app.use(`${url}/auth`, authRouter);
app.use(`${url}/home`, homeRouter);
app.use(`${url}/user`, userRouter);
app.use(`${url}/portfoilo`, portfoiloRouter);
app.use(`${url}/data`, dataRouter);
app.use(`/:error`, (req, res) => {
  const { error } = req.params;
  res.send(`hi from error:- you write ${error} and there is no api like this`);
});

// connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, console.log(`server is listen on http://localhost:${port}`));
