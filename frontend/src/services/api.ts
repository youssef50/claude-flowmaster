import axios from 'axios';
import type { Team, Engineer, SlackConfig, Workflow, Runbook, Folder, Tag } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Teams
export const teamsApi = {
  getAll: () => api.get<Team[]>('/teams'),
  getOne: (id: string) => api.get<Team>(`/teams/${id}`),
  create: (data: Partial<Team>) => api.post<Team>('/teams', data),
  update: (id: string, data: Partial<Team>) => api.patch<Team>(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
};

// Engineers
export const engineersApi = {
  getAll: (teamId?: string) => api.get<Engineer[]>('/engineers', { params: { teamId } }),
  getOne: (id: string) => api.get<Engineer>(`/engineers/${id}`),
  create: (data: Partial<Engineer>) => api.post<Engineer>('/engineers', data),
  update: (id: string, data: Partial<Engineer>) => api.patch<Engineer>(`/engineers/${id}`, data),
  delete: (id: string) => api.delete(`/engineers/${id}`),
};

// Slack Config
export const slackConfigApi = {
  getAll: () => api.get<SlackConfig[]>('/slack-config'),
  getOne: (id: string) => api.get<SlackConfig>(`/slack-config/${id}`),
  create: (data: Partial<SlackConfig>) => api.post<SlackConfig>('/slack-config', data),
  update: (id: string, data: Partial<SlackConfig>) => api.patch<SlackConfig>(`/slack-config/${id}`, data),
  delete: (id: string) => api.delete(`/slack-config/${id}`),
};

// Workflows
export const workflowsApi = {
  getAll: () => api.get<Workflow[]>('/workflows'),
  getOne: (id: string) => api.get<Workflow>(`/workflows/${id}`),
  create: (data: Partial<Workflow>) => api.post<Workflow>('/workflows', data),
  update: (id: string, data: Partial<Workflow>) => api.patch<Workflow>(`/workflows/${id}`, data),
  delete: (id: string) => api.delete(`/workflows/${id}`),
  execute: (id: string, initialData?: Record<string, any>) =>
    api.post(`/workflows/${id}/execute`, { initialData }),
};

// Runbooks
export const runbooksApi = {
  getAll: (folderId?: string, tagId?: string) => api.get<Runbook[]>('/runbooks', { params: { folderId, tagId } }),
  getOne: (id: string) => api.get<Runbook>(`/runbooks/${id}`),
  create: (data: Partial<Runbook> & { tagIds?: string[] }) => api.post<Runbook>('/runbooks', data),
  update: (id: string, data: Partial<Runbook> & { tagIds?: string[] }) => api.patch<Runbook>(`/runbooks/${id}`, data),
  delete: (id: string) => api.delete(`/runbooks/${id}`),
};

// Folders
export const foldersApi = {
  getAll: () => api.get<Folder[]>('/folders'),
  create: (data: Partial<Folder>) => api.post<Folder>('/folders', data),
  delete: (id: string) => api.delete(`/folders/${id}`),
};

// Tags
export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags'),
  create: (data: Partial<Tag>) => api.post<Tag>('/tags', data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

export default api;
