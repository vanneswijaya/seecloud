# SeeCloud: AWS IAM Visual Composer

![Screenshot 2024-10-29 at 2 05 23 PM](https://github.com/user-attachments/assets/333698d7-f49b-4acd-b253-974f45a00201)
![Screenshot 2024-10-29 at 2 05 50 PM](https://github.com/user-attachments/assets/dc1cd181-1946-4495-b9c1-cab3787c56a0)

## Introduction

SeeCloud is a novel visual composing system created to address the bottlenecks associated with provisioning and managing access control in AWS Identity & Access Management (IAM). SeeCloud simplifies the AWS IAM provisioning process by allowing users to easily set up their access control through SeeCloud's diagramming interface. SeeCloud will automatically generate an AWS CloudFormation code from the composed diagram through its diagram interpreter. SeeCloud is also equipped with an integrated change manager that allows users to easily generate pull requests and automatically deploy merged changes to their AWS account. Additionally, SeeCloud offers a graph-based access analyzer engine that allows users to validate their access schema against a specified security property. The project is built as a full-stack application, with React on the frontend and Node with Express on the backend.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

First, clone the SeeCloud repository to your local machine:

```bash
git clone https://github.com/vanneswijaya/seecloud.git
cd seecloud
```

### 2. Install Dependencies

The project is divided into two main directories: `client/` and `server/`. You need to install dependencies for both.

#### Install Client Dependencies

Navigate to the `client/` directory and install the dependencies:

```bash
cd client/
npm install
```

#### Install Server Dependencies

Navigate to the `server/` directory and install the dependencies:

```bash
cd ../server/
npm install
```

### 3. Set Up Environment Variables

The server requires a `.env` file to be created in the `server/` directory. This file should contain the following environment variables:

```bash
PORT=8080
GH_TOKEN=*insert github generated access token*
OWNER=vanneswijaya
REPO=seecloud
```

Replace `*insert github generated access token*` with your actual GitHub access token.

### 4. Run the Application

#### Start the Server

In the `server/` directory, start the server using:

```bash
npm run dev
```

This will start the Node.js server on the specified port (default is `8080`).

#### Start the Client

In the `client/` directory, start the Next.js React app using:

```bash
npm run dev
```

This will start the frontend application on `localhost:3000`.

### 5. Access the Application

Once both the client and server are running, open your web browser and navigate to:

```
http://localhost:3000
```

You should now see the SeeCloud web interface and be able to use the application.

## AWS Integration (Optional)

If you want to use features related to importing instances from your AWS account or deploying your IAM code to AWS, you will need to configure your SDK authentication with AWS.

### Configure AWS SDK

1. **Set Up AWS Access Portal Session**: Follow the instructions in the [AWS SDK for JavaScript v3 Developer Guide](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-your-credentials.html) to configure your AWS credentials.

2. **Ensure AWS CLI is Installed**: If you haven't already, install the [AWS CLI](https://aws.amazon.com/cli/) and configure it with your credentials.

3. **Verify Configuration**: Run the following command to verify that your AWS credentials are correctly configured:

   ```bash
   aws sts get-caller-identity
   ```

   This should return details about your AWS account.

Once your AWS SDK is configured, you can use the AWS-related features in the SeeCloud application.

## Troubleshooting

- **Port Conflicts**: If you encounter port conflicts, ensure that no other applications are using ports `3000` (client) or `8080` (server). You can change the ports in the `.env` file for the server and in the `client/package.json` for the client.

- **Missing Dependencies**: If you encounter issues with missing dependencies, try deleting the `node_modules` directory and the `package-lock.json` file in both `client/` and `server/` directories, then run `npm install` again.

- **Environment Variables**: Ensure that the `.env` file is correctly set up in the `server/` directory and that all required variables are present.

## Contributing

If you would like to contribute to the SeeCloud project, please fork the repository and submit a pull request. We welcome contributions from the community!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using SeeCloud! If you have any questions or run into any issues, please feel free to open an issue on the GitHub repository.
