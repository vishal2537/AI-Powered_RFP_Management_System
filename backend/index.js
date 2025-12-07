import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dbConnection from "./dBConfig/index.js";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8800;

dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(routes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(
    "Server running on port " + PORT
  );
});
  