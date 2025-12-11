import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { NodePalette } from '../components/NodePalette';
import { NodeConfigPanel } from '../components/NodeConfigPanel';
import { useWorkflowStore } from '../stores/workflowStore';
import { workflowsApi } from '../services/api';

export const WorkflowEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { nodes, edges, clearWorkflow, setNodes, setEdges } = useWorkflowStore();
  const [workflowName, setWorkflowName] = useState('');

  // Load workflow if editing
  const { data: workflow } = useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await workflowsApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
  });

  React.useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.name);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    }
  }, [workflow, setNodes, setEdges]);

  // Save workflow
  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: workflowName,
        nodes,
        edges,
      };

      if (id) {
        return workflowsApi.update(id, data);
      } else {
        return workflowsApi.create(data);
      }
    },
    onSuccess: () => {
      alert('Workflow saved successfully!');
      navigate('/workflows');
    },
  });

  // Execute workflow
  const executeMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        alert('Please save the workflow first');
        return;
      }
      return workflowsApi.execute(id);
    },
    onSuccess: (response) => {
      alert('Workflow executed successfully!');
      console.log('Execution result:', response?.data);
    },
    onError: (error: any) => {
      alert(`Execution failed: ${error.response?.data?.message || error.message}`);
    },
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/workflows')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow name..."
            className="text-xl font-bold border-none outline-none"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => executeMutation.mutate()}
            disabled={!id || executeMutation.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {executeMutation.isPending ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <NodePalette />
        <WorkflowCanvas />
        <NodeConfigPanel />
      </div>
    </div>
  );
};
