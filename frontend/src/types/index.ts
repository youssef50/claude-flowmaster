export interface Team {
  id: string;
  name: string;
  description?: string;
  engineers?: Engineer[];
  createdAt: string;
  updatedAt: string;
}

export interface Engineer {
  id: string;
  name: string;
  email: string;
  slackUserId?: string;
  teamId: string;
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface SlackConfig {
  id: string;
  workspace: string;
  botToken: string;
  defaultChannel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  runs?: WorkflowRun[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt: string;
  finishedAt?: string;
  logs?: Record<string, any>;
  error?: string;
  createdAt: string;
}

export interface WorkflowNodeData {
  label: string;
  [key: string]: any;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    runbooks: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  _count?: {
    runbooks: number;
  };
}

export interface RunbookTag {
  tag: Tag;
}

export interface Runbook {
  id: string;
  title: string;
  description?: string;
  content: any;
  folderId?: string;
  folder?: Folder;
  tags?: RunbookTag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  tenant?: Tenant;
  columns?: ProjectColumn[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    columns: number;
  };
}

export interface ProjectColumn {
  id: string;
  title: string;
  order: number;
  projectId: string;
  project?: Project;
  cards?: ProjectCard[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCard {
  id: string;
  content: string;
  order: number;
  columnId: string;
  column?: ProjectColumn;
  createdAt: string;
  updatedAt: string;
}
