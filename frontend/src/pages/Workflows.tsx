import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsApi } from '../services/api';
import type { Workflow } from '../types';

export const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await workflowsApi.getAll();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workflowsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
        <p className="text-gray-600 mt-2">Automate your team communications</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate('/workflows/new')}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows?.map((workflow: Workflow) => (
          <div
            key={workflow.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/workflows/${workflow.id}`)}
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{workflow.name}</h3>
                {workflow.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workflow.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  Active
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this workflow?')) {
                    deleteMutation.mutate(workflow.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {workflows?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-4xl mb-4 block">🔄</span>
          <p className="text-gray-500 mb-4">No workflows yet. Create your first workflow to get started!</p>
          <button
            onClick={() => navigate('/workflows/new')}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Workflow
          </button>
        </div>
      )}
    </div>
  );
};
