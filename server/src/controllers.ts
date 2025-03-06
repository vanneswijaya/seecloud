import { Router, Request, Response } from "express";
import {
  createCommit,
  createPullRequest,
  getGitHubUsername,
  getPullRequestCanvasData,
  getPullRequestDiagramSnapshot,
  getPullRequestTemplateData,
  listBranches,
  listSeeCloudPullRequests,
  setActivePr,
} from "./services";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
import {
  CloudFormationClient,
  CreateStackCommand,
  UpdateStackCommand,
} from "@aws-sdk/client-cloudformation";

export default () => {
  const app = Router();
  const ec2Client = new EC2Client({ region: "us-east-1" });
  const s3Client = new S3Client({ region: "us-east-1" });
  const rdsClient = new RDSClient({ region: "us-east-1" });
  const cfClient = new CloudFormationClient({ region: "us-east-1" });

  app.get("/", async (req: Request, res: Response) => {
    const username = await getGitHubUsername();
    res.send("Hi, " + username);
  });

  app.get("/list-branches", async (req: Request, res: Response) => {
    const branches = await listBranches();
    res.json(branches);
  });

  app.get("/list-pull-requests", async (req: Request, res: Response) => {
    const prs = await listSeeCloudPullRequests();
    res.json(prs);
  });

  app.get("/get-pr-canvas-data", async (req: Request, res: Response) => {
    const canvasData = await getPullRequestCanvasData(req.query.prNumber);
    res.json(canvasData);
  });

  app.get("/get-pr-diagram-snapshot", async (req: Request, res: Response) => {
    const canvasData = await getPullRequestDiagramSnapshot(req.query.prNumber);
    res.send(canvasData);
  });

  app.get("/get-pr-template-data", async (req: Request, res: Response) => {
    const templateData = await getPullRequestTemplateData(req.query.prNumber);
    res.json(templateData);
  });

  app.get("/list-ec2-reservations", async (req: Request, res: Response) => {
    const command = new DescribeInstancesCommand();
    const reservations = await ec2Client.send(command);
    res.json(reservations);
  });

  app.get("/list-s3-buckets", async (req: Request, res: Response) => {
    const command = new ListBucketsCommand();
    const buckets = await s3Client.send(command);
    res.json(buckets);
  });

  app.get("/list-rds-instances", async (req: Request, res: Response) => {
    const command = new DescribeDBInstancesCommand();
    const instances = await rdsClient.send(command);
    res.json(instances);
  });

  app.post("/new-commit", async (req: Request, res: Response) => {
    const existingBranch = req.body.existingBranch;
    const newBranch = req.body.newBranch;
    const baseBranch = req.body.baseBranch;
    const commitMsg = req.body.commitMsg;
    const templateContent = req.body.templateContent;
    const canvasData = req.body.canvasData;
    const snapshotUri = req.body.snapshotUri;

    await createCommit(
      existingBranch,
      newBranch,
      baseBranch,
      commitMsg,
      templateContent,
      canvasData,
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
    const canvasData = req.body.canvasData;
    const snapshotUri = req.body.snapshotUri;

    const newRef = await createCommit(
      existingBranch,
      newBranch,
      baseBranch,
      commitMsg,
      templateContent,
      canvasData,
      snapshotUri
    );

    const newPr = await createPullRequest(newRef, prTitle, prBody, baseBranch);

    res.send(newPr.data.html_url);
  });

  app.post("/set-active-pr", async (req: Request, res: Response) => {
    const newActivePrNumber = req.body.newActivePrNumber;
    const prevActivePrNumber = req.body.prevActivePrNumber;

    const label = await setActivePr(newActivePrNumber, prevActivePrNumber);
    res.json(label);
  });

  app.post("/create-stack", async (req: Request, res: Response) => {
    const input = {
      StackName: "SeeCloudTestStack",
      TemplateBody: req.body.templateContent,
      Capabilities: ["CAPABILITY_IAM"],
    };
    const command = new CreateStackCommand(input);
    const response = await cfClient.send(command);
    res.json(response);
  });

  app.post("/update-stack", async (req: Request, res: Response) => {
    const input = {
      StackName: "SeeCloudTestStack",
      TemplateBody: req.body.templateContent,
      Capabilities: ["CAPABILITY_IAM"],
    };
    const command = new UpdateStackCommand(input);
    const response = await cfClient.send(command);
    res.json(response);
  });

  return app;
};
