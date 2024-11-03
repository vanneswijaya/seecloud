import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Octokit } from "octokit";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const owner = "vanneswijaya";
const repo = "seecloud";
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

app.get("/generate-pull-request", async (req: Request, res: Response) => {
  const new_blob = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner: owner,
      repo: repo,
      content: "Content of the blob",
      encoding: "utf-8",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const master_latest_commit = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: owner,
      repo: repo,
      ref: "heads/main",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_tree = await octokit.request(
    "POST /repos/{owner}/{repo}/git/trees",
    {
      owner: owner,
      repo: repo,
      base_tree: master_latest_commit.data.commit.tree.sha,
      tree: [
        {
          path: "test.txt",
          mode: "100644",
          type: "blob",
          sha: new_blob.data.sha,
        },
      ],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_commit = await octokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: owner,
      repo: repo,
      message: "test commit message",
      author: {
        name: "SeeCloud",
        email: "seecloud@github.com",
      },
      parents: [master_latest_commit.data.sha],
      tree: new_tree.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_ref = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: owner,
    repo: repo,
    ref: "refs/heads/seecloud-change-manager",
    sha: new_commit.data.sha,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const new_pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: owner,
    repo: repo,
    title: "test new pr",
    body: "Please pull these awesome changes in!",
    head: new_ref.data.ref.split("/")[2],
    base: "main",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  res.send("Successfully created PR: " + new_pr.data.html_url);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
