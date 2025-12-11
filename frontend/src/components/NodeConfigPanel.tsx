import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { teamsApi, engineersApi } from '../services/api';
import { useWorkflowStore } from '../stores/workflowStore';

export const NodeConfigPanel: React.FC = () => {
  const { selectedNode, updateNode, removeNode, setSelectedNode } = useWorkflowStore();

  const handleDeleteNode = () => {
    if (selectedNode && confirm('Are you sure you want to delete this node?')) {
      removeNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <p className="text-gray-500">Select a node to configure</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{selectedNode.data.label}</h3>
        <button
          onClick={handleDeleteNode}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          title="Delete node (Del/Backspace)"
        >
          Delete
        </button>
      </div>

      {selectedNode.type === 'selectTeam' && (
        <SelectTeamConfig nodeId={selectedNode.id} data={selectedNode.data} />
      )}

      {selectedNode.type === 'selectEngineer' && (
        <SelectEngineerConfig nodeId={selectedNode.id} data={selectedNode.data} />
      )}

      {selectedNode.type === 'composeMessage' && (
        <ComposeMessageConfig nodeId={selectedNode.id} data={selectedNode.data} />
      )}

      {selectedNode.type === 'sendSlackMessage' && (
        <SendSlackMessageConfig nodeId={selectedNode.id} data={selectedNode.data} />
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Tip: Press Delete or Backspace to remove this node
        </p>
      </div>
    </div>
  );
};

const SelectTeamConfig: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNode } = useWorkflowStore();
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.getAll();
      return response.data;
    },
  });

  const handleTeamChange = (teamId: string) => {
    const team = teams?.find((t) => t.id === teamId);
    updateNode(nodeId, {
      teamId,
      teamName: team?.name,
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Team</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2"
        value={data.teamId || ''}
        onChange={(e) => handleTeamChange(e.target.value)}
      >
        <option value="">Choose a team...</option>
        {teams?.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const SelectEngineerConfig: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNode } = useWorkflowStore();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const { data: engineers } = useQuery({
    queryKey: ['engineers', selectedTeamId],
    queryFn: async () => {
      const response = await engineersApi.getAll(selectedTeamId || undefined);
      return response.data;
    },
  });

  const handleEngineerChange = (engineerId: string) => {
    const engineer = engineers?.find((e) => e.id === engineerId);
    updateNode(nodeId, {
      engineerId,
      engineerName: engineer?.name,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Filter by Team (optional)</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          <option value="">All teams...</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Select Engineer</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2"
          value={data.engineerId || ''}
          onChange={(e) => handleEngineerChange(e.target.value)}
        >
          <option value="">Choose an engineer...</option>
          {engineers?.map((engineer) => (
            <option key={engineer.id} value={engineer.id}>
              {engineer.name} ({engineer.team?.name})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ComposeMessageConfig: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNode } = useWorkflowStore();

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Message Template</label>
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 h-32"
        placeholder="Use {{variableName}} for dynamic values"
        value={data.messageTemplate || ''}
        onChange={(e) => updateNode(nodeId, { messageTemplate: e.target.value })}
      />
      <p className="text-xs text-gray-500 mt-2">
        Available variables: teamName, engineerName, engineerEmail
      </p>
    </div>
  );
};

const SendSlackMessageConfig: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNode } = useWorkflowStore();

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Channel (optional)</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="#general"
        value={data.channel || ''}
        onChange={(e) => updateNode(nodeId, { channel: e.target.value })}
      />
      <p className="text-xs text-gray-500 mt-2">
        Leave empty to use engineer's DM from previous node
      </p>
    </div>
  );
};
