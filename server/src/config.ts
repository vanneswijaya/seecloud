import dotenv from "dotenv";
dotenv.config();

export default {
  owner: process.env.OWNER,
  repo: process.env.REPO,
  port: process.env.PORT || 3000,
};
