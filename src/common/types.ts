export interface StageComponentProps {
  id: string;
  x?: number;
  y?: number;
  componentType: ComponentTemplate;
}

export interface ComponentTemplate {
  id: string;
  imagePath: string;
  defaultLogicalId: string;
  typeDescription: string;
}

export interface Connector {
  id: string;
  from: string;
  to?: string;
}