require("dotenv").config({ path: "./local.env" });
const morgan = require("morgan");
const express = require("express");
const { connectMongo } = require("./utils/connectMongo");
const { errorHandler } = require("./utils/errorHandler");
const { authRouter } = require("./controllers/authRouter");
const { usersRouter } = require("./controllers/usersRouter");
const { notesRouter } = require("./controllers/notesRouter");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.static('build'))
app.use(morgan("tiny"));
app.use(express.json());
app.use(errorHandler);
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);

const onStart = async () => {
  try {
    await connectMongo();
    console.log("Connection with database has launched successfully!");
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
  } catch (err) {
    console.error("Served launch failed: ", err.message);
  }
};
onStart();
