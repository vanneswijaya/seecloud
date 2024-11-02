import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Octokit } from "octokit";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

app.get("/", async (req: Request, res: Response) => {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  res.send("Hi, " + login);
});

app.get("/create-issue", async (req: Request, res: Response) => {
  const result = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: "vanneswijaya",
    repo: "seecloud",
    title: "Created with the REST API",
    body: "This is a test issue created by the REST API",
  });
  res.send(`Issue created: ${result}`);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
