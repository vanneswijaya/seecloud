import dotenv from "dotenv";
dotenv.config();

export default {
  owner: "vanneswijaya",
  repo: "seecloud",
  port: process.env.PORT || 3000,
};
