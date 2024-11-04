import express, { Express } from "express";
import dotenv from "dotenv";
import controllers from "./controllers";
import config from "./config";

dotenv.config();

const app: Express = express();
const port = config.port;

app.use(express.json());

app.use(controllers());

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
