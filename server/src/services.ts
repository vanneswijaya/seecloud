import { Octokit } from "octokit";
import config from "./config";

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

export const getGitHubUsername = async () => {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  return login;
};

export const listBranches = async () => {
  return await octokit.request("GET /repos/{owner}/{repo}/branches", {
    owner: config.owner,
    repo: config.repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const createCommit = async (
  existingBranch,
  newBranch,
  baseBranch,
  commitMsg,
  templateContent,
  canvasData,
  snapshotUri
) => {
  const templateBlob = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner: config.owner,
      repo: config.repo,
      content: templateContent,
      encoding: "utf-8",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const canvasDataBlob = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner: config.owner,
      repo: config.repo,
      content: canvasData,
      encoding: "utf-8",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const imageBlob = await octokit.request(
    "POST /repos/{owner}/{repo}/git/blobs",
    {
      owner: config.owner,
      repo: config.repo,
      content: snapshotUri,
      encoding: "base64",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const latest_commit = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: config.owner,
      repo: config.repo,
      ref: "heads/" + (existingBranch || baseBranch),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const new_tree = await octokit.request(
    "POST /repos/{owner}/{repo}/git/trees",
    {
      owner: config.owner,
      repo: config.repo,
      base_tree: latest_commit.data.commit.tree.sha,
      tree: [
        {
          path: "iamCloudFormationTemplate.json",
          mode: "100644",
          type: "blob",
          sha: templateBlob.data.sha,
        },
        {
          path: "diagramSnapshot.png",
          mode: "100644",
          type: "blob",
          sha: imageBlob.data.sha,
        },
        {
          path: "seecloudCanvasData.json",
          mode: "100644",
          type: "blob",
          sha: canvasDataBlob.data.sha,
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
      owner: config.owner,
      repo: config.repo,
      message: commitMsg,
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
      owner: config.owner,
      repo: config.repo,
      ref: existingBranch
        ? "heads/" + existingBranch
        : "refs/heads/" + newBranch,
      sha: new_commit.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return new_ref;
};

export const createPullRequest = async (
  newRef,
  prTitle,
  prBody,
  baseBranch
) => {
  return await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: config.owner,
    repo: config.repo,
    title: prTitle,
    body: prBody,
    head: newRef.data.ref.split("/")[2],
    base: baseBranch,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};
