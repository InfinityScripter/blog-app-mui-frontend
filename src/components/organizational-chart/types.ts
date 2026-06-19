import type { ReactElement } from "react";

// ----------------------------------------------------------------------

export interface OrgChartNode {
  [key: string]: unknown;
  children?: OrgChartNode[];
}

export type OrgChartNodeProps = OrgChartNode & {
  depth?: number;
  totalChildren?: number;
};

export type OrgChartRenderNode = (props: OrgChartNodeProps) => ReactElement;

export interface OrganizationalChartProps {
  data: OrgChartNode;
  nodeItem: OrgChartRenderNode;
  lineHeight?: string;
  lineWidth?: string;
  lineColor?: string;
  lineBorderRadius?: string;
  nodePadding?: string;
}

export interface TreeListProps {
  data: OrgChartNode;
  depth: number;
  nodeItem: OrgChartRenderNode;
}

export interface TreeSubListProps {
  data: OrgChartNode[];
  depth: number;
  nodeItem: OrgChartRenderNode;
}
