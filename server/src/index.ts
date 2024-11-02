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
  console.log("Hi, %s", login);
  res.send("Express");
});

// app.get("/test-octokit", async (req: Request, res: Response) => {
//   await octokit.request("POST /repos/{owner}/{repo}/issues", {
//     owner: "octocat",
//     repo: "Spoon-Knife",
//     title: "Created with the REST API",
//     body: "This is a test issue created by the REST API",
//   });
//   res.send("Express");
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
