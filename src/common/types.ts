/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface StageComponentProps {
//   id: string;
//   x?: number;
//   y?: number;
//   componentType: ComponentTemplate;
// }

// export interface ComponentTemplate {
//   id: string;
//   imagePath: string;
//   typeDescription: string;
//   templateValue: any;
// }

export interface Connector {
  id: string;
  from: string;
  to?: string;
}

export interface StageComponentInterface {
  id: string;
  position: StagePosition;
  componentType: ComponentType;
  logicalId: string;
  templateValue: any;
}

export interface StagePosition {
  x?: number;
  y?: number;
}

export interface ComponentType {
  iconPath: string;
  typeName: string;
  defaultLogicalId: string;
  defaultTemplateValue: any;
}

export interface Template {
  AWSTemplateFormatVersion: string;
  Description: string;
  Resources: any;
}
