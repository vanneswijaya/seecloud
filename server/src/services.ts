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

export const listSeeCloudPullRequests = async () => {
  const allPrs = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: config.owner,
    repo: config.repo,
    state: "all",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return allPrs.data.filter((x) => x.title.startsWith("[SeeCloud]"));
};

export const getPullRequestCanvasData = async (prNumber) => {
  const prFiles = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: config.owner,
      repo: config.repo,
      pull_number: prNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const canvasDataBase64 = await octokit.request(
    "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
    {
      owner: config.owner,
      repo: config.repo,
      file_sha: prFiles.data.find(
        (file) => file.filename === "seecloud/seecloudCanvasData.json"
      ).sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const canvasDataObject = JSON.parse(
    Buffer.from(canvasDataBase64.data.content, "base64").toString("utf-8")
  );

  return canvasDataObject;
};

export const getPullRequestDiagramSnapshot = async (prNumber) => {
  const prFiles = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: config.owner,
      repo: config.repo,
      pull_number: prNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const canvasDataBase64 = await octokit.request(
    "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
    {
      owner: config.owner,
      repo: config.repo,
      file_sha: prFiles.data.find(
        (file) => file.filename === "seecloud/diagramSnapshot.png"
      ).sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return canvasDataBase64.data.content;
};

export const getPullRequestTemplateData = async (prNumber) => {
  const prFiles = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: config.owner,
      repo: config.repo,
      pull_number: prNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const canvasDataBase64 = await octokit.request(
    "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
    {
      owner: config.owner,
      repo: config.repo,
      file_sha: prFiles.data.find(
        (file) => file.filename === "seecloud/iamCloudFormationTemplate.json"
      ).sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const canvasDataObject = JSON.parse(
    Buffer.from(canvasDataBase64.data.content, "base64").toString("utf-8")
  );

  return canvasDataObject;
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
          path: "seecloud/iamCloudFormationTemplate.json",
          mode: "100644",
          type: "blob",
          sha: templateBlob.data.sha,
        },
        {
          path: "seecloud/diagramSnapshot.png",
          mode: "100644",
          type: "blob",
          sha: imageBlob.data.sha,
        },
        {
          path: "seecloud/seecloudCanvasData.json",
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

export const setActivePr = async (
  newActivePrNumber: number,
  prevActivePrNumber?: number
) => {
  prevActivePrNumber &&
    (await octokit.request(
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
      {
        owner: config.owner,
        repo: config.repo,
        issue_number: prevActivePrNumber,
        name: "seecloud-active",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    ));
  return await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
    {
      owner: config.owner,
      repo: config.repo,
      issue_number: newActivePrNumber,
      labels: ["seecloud-active"],
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
};
