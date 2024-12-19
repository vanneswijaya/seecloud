import express, { Express } from "express";
import dotenv from "dotenv";
import controllers from "./controllers";
import config from "./config";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = config.port;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(controllers());

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
