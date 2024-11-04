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

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  res.send("Hi, " + login);
});

app.get("/list-branches", async (req: Request, res: Response) => {
  const branches = await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: owner,
    repo: repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  res.send(branches);
});

app.post("/generate-pull-request", async (req: Request, res: Response) => {
  const existingBranch = req.body.existingBranch;
  const newBranch = req.body.newBranch;
  const baseBranch = req.body.baseBranch;

  const new_blob = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner: owner,
      repo: repo,
      content: "Content of the blob + 1",
      encoding: "utf-8",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latest_commit = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: owner,
      repo: repo,
      ref: "heads/" + (existingBranch || baseBranch),
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
      base_tree: latest_commit.data.commit.tree.sha,
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
      message: req.body.commitMsg,
      author: {
        name: "SeeCloud",
        email: "seecloud@github.com",
      },
      parents: [latest_commit.data.sha],
      tree: new_tree.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_ref = await octokit.request(
    existingBranch
      ? "PATCH /repos/{owner}/{repo}/git/refs/{ref}"
      : "POST /repos/{owner}/{repo}/git/refs",
    {
      owner: owner,
      repo: repo,
      ref: existingBranch
        ? "heads/" + existingBranch
        : "refs/heads/" + newBranch,
      sha: new_commit.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: owner,
    repo: repo,
    title: req.body.prTitle,
    body: req.body.prBody,
    head: new_ref.data.ref.split("/")[2],
    base: baseBranch,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  res.send("Successfully created PR: " + new_pr.data.html_url);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
