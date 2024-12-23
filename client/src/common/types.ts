/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Connector {
  id: string;
  from: StageComponentInterface;
  to: StageComponentInterface | null;
  policyStatementSid: string;
  type: "default" | "generic-to-instance" | "service-to-policy";
}

export interface StageComponentInterface {
  id: string;
  position: StagePosition;
  componentData: ComponentData;
}

export interface StagePosition {
  x?: number;
  y?: number;
}

export interface ComponentDataBasics {
  iconPath: string;
  typeName: string;
  displayName?: string;
}

export interface IamTemplate extends ComponentDataBasics {
  type: "iam-template";
  logicalId?: string;
  templateValue?: any;
  defaultLogicalId: string;
  defaultTemplateValue: any;
}

export interface GenericService extends ComponentDataBasics {
  type: "generic-service";
  actions: string[];
}

export interface ImportedInstance extends ComponentDataBasics {
  type: "imported-instance";
  arn: string;
  instanceId: string;
  name: string;
  actions: string[];
}

export type ComponentData = IamTemplate | GenericService | ImportedInstance;

export interface Template {
  AWSTemplateFormatVersion: string;
  Description: string;
  Resources: any;
}

export interface ServiceConnection {
  policy: StageComponentInterface | null;
  service: StageComponentInterface | null;
  policyStatementSid: string;
}

export interface PullRequest {
  html_url: string;
  title: string;
  merged_at?: string;
  head: {
    label: string;
  };
  updated_at: string;
  number: number;
  state: string;
  labels: { name: string }[];
}
