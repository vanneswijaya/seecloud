import { Router, Request, Response } from "express";
import {
  createCommit,
  createPullRequest,
  getGitHubUsername,
  listBranches,
} from "./services";

export default () => {
  const app = Router();

  app.get("/", async (req: Request, res: Response) => {
    const username = await getGitHubUsername();
    res.send("Hi, " + username);
  });

  app.get("/list-branches", async (req: Request, res: Response) => {
    const branches = await listBranches();
    res.json(branches);
  });

  app.post("/new-commit", async (req: Request, res: Response) => {
    const existingBranch = req.body.existingBranch;
    const newBranch = req.body.newBranch;
    const baseBranch = req.body.baseBranch;
    const commitMsg = req.body.commitMsg;
    const templateContent = req.body.templateContent;
    const snapshotUri = req.body.snapshotUri;

    await createCommit(
      existingBranch,
      newBranch,
      baseBranch,
      commitMsg,
      templateContent,
      snapshotUri
    );

    res.send(commitMsg);
  });

  app.post("/generate-pull-request", async (req: Request, res: Response) => {
    const existingBranch = req.body.existingBranch;
    const newBranch = req.body.newBranch;
    const baseBranch = req.body.baseBranch;
    const commitMsg = req.body.commitMsg;
    const prTitle = req.body.prTitle;
    const prBody = req.body.prBody;
    const templateContent = req.body.templateContent;
    const snapshotUri = req.body.snapshotUri;

    const newRef = await createCommit(
      existingBranch,
      newBranch,
      baseBranch,
      commitMsg,
      templateContent,
      snapshotUri
    );

    const newPr = await createPullRequest(newRef, prTitle, prBody, baseBranch);

    res.send(newPr.data.html_url);
  });

  return app;
};
