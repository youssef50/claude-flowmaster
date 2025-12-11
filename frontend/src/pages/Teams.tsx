import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, engineersApi } from '../services/api';
import type { Team, Engineer } from '../types';

export const Teams: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isCreatingEngineer, setIsCreatingEngineer] = useState(false);
  const [teamFormData, setTeamFormData] = useState({ name: '', description: '' });
  const [engineerFormData, setEngineerFormData] = useState({
    name: '',
    email: '',
    slackUserId: '',
    teamId: '',
  });

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.getAll();
      return response.data;
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: Partial<Team>) => teamsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreatingTeam(false);
      setTeamFormData({ name: '', description: '' });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const createEngineerMutation = useMutation({
    mutationFn: (data: Partial<Engineer>) => engineersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreatingEngineer(false);
      setEngineerFormData({ name: '', email: '', slackUserId: '', teamId: '' });
    },
  });

  const deleteEngineerMutation = useMutation({
    mutationFn: (id: string) => engineersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
        <p className="text-gray-600 mt-2">Manage teams and their members</p>
      </div>

      <div className="mb-6 flex space-x-3">
        <button
          onClick={() => setIsCreatingTeam(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Team
        </button>
        <button
          onClick={() => setIsCreatingEngineer(true)}
          className="px-4 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          + Add Engineer
        </button>
      </div>

      {isCreatingTeam && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Team</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Backend Team"
                value={teamFormData.name}
                onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
              <textarea
                placeholder="Brief description of the team"
                value={teamFormData.description}
                onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => createTeamMutation.mutate(teamFormData)}
                disabled={!teamFormData.name || createTeamMutation.isPending}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
              </button>
              <button
                onClick={() => setIsCreatingTeam(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatingEngineer && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Engineer to Team</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={engineerFormData.name}
                onChange={(e) =>
                  setEngineerFormData({ ...engineerFormData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="john.doe@company.com"
                value={engineerFormData.email}
                onChange={(e) =>
                  setEngineerFormData({ ...engineerFormData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slack User ID (optional)</label>
              <input
                type="text"
                placeholder="U123456789"
                value={engineerFormData.slackUserId}
                onChange={(e) =>
                  setEngineerFormData({ ...engineerFormData, slackUserId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
              <select
                value={engineerFormData.teamId}
                onChange={(e) =>
                  setEngineerFormData({ ...engineerFormData, teamId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a team...</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => createEngineerMutation.mutate(engineerFormData)}
                disabled={!engineerFormData.name || !engineerFormData.email || !engineerFormData.teamId || createEngineerMutation.isPending}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createEngineerMutation.isPending ? 'Adding...' : 'Add Engineer'}
              </button>
              <button
                onClick={() => setIsCreatingEngineer(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams?.map((team: Team) => (
          <div key={team.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  {team.description && (
                    <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {team.engineers?.length || 0} {team.engineers?.length === 1 ? 'engineer' : 'engineers'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure? This will delete the team and all its engineers.')) {
                    deleteTeamMutation.mutate(team.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>

            {team.engineers && team.engineers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  {team.engineers.map((engineer) => (
                    <div
                      key={engineer.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-sm font-medium">
                            {engineer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{engineer.name}</p>
                          <p className="text-xs text-gray-500">{engineer.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${engineer.name}?`)) {
                            deleteEngineerMutation.mutate(engineer.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {teams?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-4xl mb-4 block">👥</span>
          <p className="text-gray-500">No teams yet. Create your first team to get started!</p>
        </div>
      )}
    </div>
  );
};
