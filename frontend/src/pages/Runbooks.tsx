import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { runbooksApi, foldersApi, tagsApi } from '../services/api';
import type { Folder, Tag } from '../types';

export const Runbooks: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#6366f1');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#8b5cf6');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: runbooks } = useQuery({
    queryKey: ['runbooks', selectedFolder, selectedTag],
    queryFn: async () => {
      const response = await runbooksApi.getAll(selectedFolder, selectedTag);
      return response.data;
    },
  });

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await foldersApi.getAll();
      return response.data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.getAll();
      return response.data;
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (data: Partial<Folder>) => foldersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setIsCreatingFolder(false);
      setFolderName('');
    },
  });

  const createTagMutation = useMutation({
    mutationFn: (data: Partial<Tag>) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsCreatingTag(false);
      setTagName('');
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      if (selectedFolder) setSelectedFolder(undefined);
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      if (selectedTag) setSelectedTag(undefined);
    },
  });

  const deleteRunbookMutation = useMutation({
    mutationFn: (id: string) => runbooksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runbooks'] });
    },
  });

  const filteredRunbooks = runbooks?.filter((runbook) =>
    runbook.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Chainboard</span>
          </button>
          <span className="text-gray-400">|</span>
          <span className="text-sm font-medium text-gray-700">Runbooks</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/workflows')}
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Workflows
          </button>
          <button
            onClick={() => navigate('/teams')}
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Teams
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Settings
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">👤</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Workspace Admin</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4">
          <button
            onClick={() => navigate('/runbooks/new')}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New Runbook
          </button>
        </div>

        {/* All Runbooks */}
        <div className="px-4 mb-2">
          <button
            onClick={() => {
              setSelectedFolder(undefined);
              setSelectedTag(undefined);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedFolder && !selectedTag
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">📚</span>
            All Runbooks
          </button>
        </div>

        {/* Folders */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Folders
            </h3>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="text-gray-400 hover:text-indigo-600"
            >
              +
            </button>
          </div>

          {isCreatingFolder && (
            <div className="mb-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                autoFocus
              />
              <input
                type="color"
                value={folderColor}
                onChange={(e) => setFolderColor(e.target.value)}
                className="w-full h-8 rounded mb-2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => createFolderMutation.mutate({ name: folderName, color: folderColor })}
                  disabled={!folderName}
                  className="flex-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setFolderName('');
                  }}
                  className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {folders?.map((folder) => (
              <div
                key={folder.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  selectedFolder === folder.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setSelectedTag(undefined);
                }}
              >
                <span>
                  <span style={{ color: folder.color }} className="mr-2">
                    {folder.icon || '📁'}
                  </span>
                  {folder.name}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">{folder._count?.runbooks || 0}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folder.name}"?`)) {
                        deleteFolderMutation.mutate(folder.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
            <button
              onClick={() => setIsCreatingTag(true)}
              className="text-gray-400 hover:text-indigo-600"
            >
              +
            </button>
          </div>

          {isCreatingTag && (
            <div className="mb-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
                autoFocus
              />
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="w-full h-8 rounded mb-2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => createTagMutation.mutate({ name: tagName, color: tagColor })}
                  disabled={!tagName}
                  className="flex-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingTag(false);
                    setTagName('');
                  }}
                  className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {tags?.map((tag) => (
              <div
                key={tag.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  selectedTag === tag.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedTag(tag.id);
                  setSelectedFolder(undefined);
                }}
              >
                <span className="flex items-center">
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">{tag._count?.runbooks || 0}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete tag "${tag.name}"?`)) {
                        deleteTagMutation.mutate(tag.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search runbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRunbooks?.map((runbook) => (
              <div
                key={runbook.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/runbooks/${runbook.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{runbook.title}</h3>
                    {runbook.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{runbook.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete runbook "${runbook.title}"?`)) {
                        deleteRunbookMutation.mutate(runbook.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {runbook.tags?.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  {runbook.folder && (
                    <span className="flex items-center">
                      <span style={{ color: runbook.folder.color }} className="mr-1">
                        {runbook.folder.icon || '📁'}
                      </span>
                      {runbook.folder.name}
                    </span>
                  )}
                  <span>{new Date(runbook.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredRunbooks?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <span className="text-4xl mb-4 block">📖</span>
              <p className="text-gray-500 mb-4">No runbooks found</p>
              <button
                onClick={() => navigate('/runbooks/new')}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Runbook
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
