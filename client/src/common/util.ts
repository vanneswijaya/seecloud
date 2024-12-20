/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from "konva/lib/Node";
import {
  Connector,
  ServiceConnection,
  StageComponentInterface,
  Template,
} from "./types";

function getRectangleBorderPoint(
  radians: number,
  size: { width: number; height: number },
  sideOffset = 0
) {
  const width = size.width + sideOffset * 2;

  const height = size.height + sideOffset * 2;

  radians %= 2 * Math.PI;
  if (radians < 0) {
    radians += Math.PI * 2;
  }

  const phi = Math.atan(height / width);

  let x = 0,
    y = 0;
  if (
    (radians >= 2 * Math.PI - phi && radians <= 2 * Math.PI) ||
    (radians >= 0 && radians <= phi)
  ) {
    x = width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= phi && radians <= Math.PI - phi) {
    y = height / 2;
    x = y / Math.tan(radians);
  } else if (radians >= Math.PI - phi && radians <= Math.PI + phi) {
    x = -width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= Math.PI + phi && radians <= 2 * Math.PI - phi) {
    y = -height / 2;
    x = y / Math.tan(radians);
  }

  return {
    x: -Math.round(x),
    y: Math.round(y),
  };
}

function getCenter(node: Node) {
  return {
    x: node.x() + node.width() / 2 + 90,
    y: node.y() + node.height() / 2 + 90,
  };
}

export function getPoints(r1: Node | null, r2: Node | null) {
  if (!r1 || !r2) {
    return [0, 0, 0, 0];
  }

  const c1 = getCenter(r1);
  const c2 = getCenter(r2);

  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const angle = Math.atan2(-dy, dx);

  const startOffset = getRectangleBorderPoint(angle + Math.PI, r1.size());
  const endOffset = getRectangleBorderPoint(angle, r2.size());

  const start = {
    x: c1.x - startOffset.x,
    y: c1.y - startOffset.y,
  };

  const end = {
    x: c2.x - endOffset.x,
    y: c2.y - endOffset.y,
  };

  return [start.x, start.y, end.x, end.y];
}

function processDeletedPolicyConnection(
  roleOrUserComponent: StageComponentInterface,
  policy: StageComponentInterface,
  stageComponents: StageComponentInterface[]
) {
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === roleOrUserComponent.id &&
      stageComponent.componentData.type === "iam-template" &&
      policy.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      const policyLogicalId = policy.componentData.logicalId;
      currentTemplateValue["Properties"]["ManagedPolicyArns"] =
        currentTemplateValue["Properties"]["ManagedPolicyArns"].filter(
          (x: { [x: string]: string }) => x["Ref"] !== policyLogicalId
        );
      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

function processPrincipalToPolicy(
  roleOrUserComponent: StageComponentInterface,
  policy: StageComponentInterface,
  stageComponents: StageComponentInterface[],
  isDeletion: boolean
): StageComponentInterface[] {
  if (isDeletion)
    return processDeletedPolicyConnection(
      roleOrUserComponent,
      policy,
      stageComponents
    );
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === roleOrUserComponent.id &&
      stageComponent.componentData.type === "iam-template" &&
      policy.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      const newRef = { Ref: policy.componentData.logicalId };
      if (
        Object.keys(currentTemplateValue["Properties"]).includes(
          "ManagedPolicyArns"
        )
      ) {
        currentTemplateValue["Properties"]["ManagedPolicyArns"].push(newRef);
      } else {
        currentTemplateValue["Properties"]["ManagedPolicyArns"] = [newRef];
      }
      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

function processDeletedUserGroupConnection(
  user: StageComponentInterface,
  group: StageComponentInterface,
  stageComponents: StageComponentInterface[]
) {
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === user.id &&
      stageComponent.componentData.type === "iam-template" &&
      group.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      const groupLogicalId = group.componentData.logicalId;
      currentTemplateValue["Properties"]["Groups"] = currentTemplateValue[
        "Properties"
      ]["Groups"].filter(
        (x: { [x: string]: string }) => x["Ref"] !== groupLogicalId
      );
      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

function processUserToGroup(
  user: StageComponentInterface,
  group: StageComponentInterface,
  stageComponents: StageComponentInterface[],
  isDeletion: boolean
): StageComponentInterface[] {
  if (isDeletion)
    return processDeletedUserGroupConnection(user, group, stageComponents);
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === user.id &&
      stageComponent.componentData.type === "iam-template" &&
      group.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      const newRef = { Ref: group.componentData.logicalId };
      if (Object.keys(currentTemplateValue["Properties"]).includes("Groups")) {
        currentTemplateValue["Properties"]["Groups"].push(newRef);
      } else {
        currentTemplateValue["Properties"]["Groups"] = [newRef];
      }
      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

function processRoleToEC2Service(
  role: StageComponentInterface,
  stageComponents: StageComponentInterface[],
  isDeletion: boolean
): StageComponentInterface[] {
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === role.id &&
      stageComponent.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      currentTemplateValue["Properties"]["AssumeRolePolicyDocument"] = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: ["ec2.amazonaws.com"],
            },
            Action: ["sts:AssumeRole"],
          },
        ],
      };
      if (isDeletion) {
        currentTemplateValue["Properties"]["AssumeRolePolicyDocument"] = {};
      }
      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

export function processNewPolicyStatement(
  newStatement: any,
  serviceConnection: ServiceConnection,
  stageComponents: StageComponentInterface[]
): StageComponentInterface[] {
  // if (isDeletion)
  //   return processDeletedPolicyConnection(
  //     roleOrUserComponent,
  //     policy,
  //     stageComponents
  //   );
  return stageComponents.map((stageComponent) => {
    if (
      stageComponent.id === serviceConnection.policy?.id &&
      stageComponent.componentData.type === "iam-template"
    ) {
      const currentTemplateValue = stageComponent.componentData.templateValue;
      if (
        currentTemplateValue["Properties"]["PolicyDocument"]["Statement"].find(
          (x: any) => x["Sid"] === serviceConnection.policyStatementSid
        )
      ) {
        currentTemplateValue["Properties"]["PolicyDocument"]["Statement"] =
          currentTemplateValue["Properties"]["PolicyDocument"]["Statement"].map(
            (statement: any) => {
              if (statement["Sid"] === serviceConnection.policyStatementSid) {
                return newStatement;
              }
              return statement;
            }
          );
      } else {
        currentTemplateValue["Properties"]["PolicyDocument"]["Statement"].push(
          newStatement
        );
      }

      return { ...stageComponent, templateValue: currentTemplateValue };
    }
    return stageComponent;
  });
}

// TODO: REFACTOR *maybe as state machine?
export function processNewOrDeletedConnector(
  from: StageComponentInterface,
  to: StageComponentInterface | null,
  stageComponents: StageComponentInterface[],
  isDeletion: boolean
): StageComponentInterface[] {
  if (from === null || to === null) return stageComponents;
  const processorMap: any = {
    "IAM Managed Policy": {
      "IAM Role": () =>
        processPrincipalToPolicy(to, from, stageComponents, isDeletion),
      "IAM User": () =>
        processPrincipalToPolicy(to, from, stageComponents, isDeletion),
      "IAM Group": () =>
        processPrincipalToPolicy(to, from, stageComponents, isDeletion),
    },
    "IAM Role": {
      "IAM Managed Policy": () =>
        processPrincipalToPolicy(from, to, stageComponents, isDeletion),
      "EC2 (*)": () =>
        processRoleToEC2Service(from, stageComponents, isDeletion),
    },
    "IAM User": {
      "IAM Managed Policy": () =>
        processPrincipalToPolicy(from, to, stageComponents, isDeletion),
      "IAM Group": () =>
        processUserToGroup(from, to, stageComponents, isDeletion),
    },
    "IAM Group": {
      "IAM Managed Policy": () =>
        processPrincipalToPolicy(from, to, stageComponents, isDeletion),
      "IAM User": () =>
        processUserToGroup(to, from, stageComponents, isDeletion),
    },
    "EC2 (*)": {
      "IAM Role": () =>
        processRoleToEC2Service(to, stageComponents, isDeletion),
    },
  };

  return processorMap[from.componentData.typeName][to.componentData.typeName]();
}

export function getJsonTemplateFromStageComponents(
  stageComponents: StageComponentInterface[]
): string {
  const template: Template = {
    AWSTemplateFormatVersion: "2010-09-09",
    Description: "A sample template",
    Resources: {},
  };
  stageComponents.forEach((stageComponent) => {
    if (
      stageComponent.componentData.type === "iam-template" &&
      stageComponent.componentData.logicalId
    ) {
      template["Resources"][stageComponent.componentData.logicalId] =
        stageComponent.componentData.templateValue;
    }
  });
  return JSON.stringify(template, null, "\t");
}

export function getId(stageComponent: StageComponentInterface): string {
  return stageComponent.componentData.type === "iam-template"
    ? stageComponent.componentData.logicalId ||
        stageComponent.componentData.defaultLogicalId
    : stageComponent.componentData.type === "generic-service"
    ? stageComponent.componentData.typeName
    : stageComponent.componentData.instanceId;
}

export function analyzeAccess(
  stageComponents: StageComponentInterface[],
  connnectors: Connector[],
  subjectId: string,
  resourceId: string
): boolean {
  // Initialize adjacency list
  const directedGraphAdjacencyList: Record<string, string[]> = {};
  stageComponents.forEach((x) => (directedGraphAdjacencyList[getId(x)] = []));

  // Define rules for edge direction based on from.typeName and to.typeName
  const edgeRules: Record<string, Record<string, "from-to" | "to-from">> = {
    "IAM Managed Policy": {
      "IAM Role": "to-from",
      "IAM User": "to-from",
      "IAM Group": "to-from",
      "EC2 (*)": "from-to",
      "S3 (*)": "from-to",
      "RDS (*)": "from-to",
      "EC2 instance": "from-to",
      "S3 bucket": "from-to",
      "RDS database": "from-to",
    },
    "IAM Role": {
      "IAM Managed Policy": "from-to",
      "EC2 (*)": "to-from",
    },
    "IAM User": {
      "IAM Managed Policy": "from-to",
      "IAM Group": "from-to",
    },
    "IAM Group": {
      "IAM Managed Policy": "from-to",
      "IAM User": "to-from",
    },
    "EC2 (*)": {
      "IAM Role": "from-to",
      "IAM Managed Policy": "to-from",
      "EC2 instance": "to-from",
    },
    "S3 (*)": {
      "IAM Managed Policy": "to-from",
    },
    "RDS (*)": {
      "IAM Managed Policy": "to-from",
    },
    "EC2 instance": {
      "IAM Managed Policy": "to-from",
      "EC2 (*)": "from-to",
    },
    "S3 bucket": {
      "IAM Managed Policy": "to-from",
    },
    "RDS database": {
      "IAM Managed Policy": "to-from",
    },
  };

  // Process each connector
  connnectors.forEach((connector) => {
    if (!connector.to) return;
    const fromId = getId(connector.from);
    const toId = getId(connector.to);

    const fromType = connector.from.componentData.typeName;
    const toType = connector.to?.componentData.typeName;

    // Determine edge direction based on rules
    const ruleDirection = edgeRules[fromType]?.[toType];

    if (ruleDirection === "from-to") {
      directedGraphAdjacencyList[fromId].push(toId);
    } else if (ruleDirection === "to-from") {
      directedGraphAdjacencyList[toId].push(fromId);
    }
  });
  console.log("graph", directedGraphAdjacencyList);

  const visited = new Set<string>();
  const stack: string[] = [subjectId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === resourceId) {
      return true; // Path found
    }

    if (!visited.has(current)) {
      visited.add(current);
      stack.push(...directedGraphAdjacencyList[current]);
    }
  }

  return false; // No path found
}
