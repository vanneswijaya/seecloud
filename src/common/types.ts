/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StageComponentProps {
  id: string;
  x?: number;
  y?: number;
  componentType: ComponentTemplate;
}

export interface ComponentTemplate {
  id: string;
  imagePath: string;
  typeDescription: string;
  templateValue: any;
}

export interface Connector {
  id: string;
  from: string;
  to?: string;
}
