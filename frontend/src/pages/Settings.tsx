import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slackConfigApi } from '../services/api';

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    workspace: '',
    botToken: '',
    defaultChannel: '',
  });

  const { data: configs } = useQuery({
    queryKey: ['slack-config'],
    queryFn: async () => {
      const response = await slackConfigApi.getAll();
      return response.data;
    },
  });

  const existingConfig = configs?.[0];

  React.useEffect(() => {
    if (existingConfig) {
      setFormData({
        workspace: existingConfig.workspace,
        botToken: existingConfig.botToken,
        defaultChannel: existingConfig.defaultChannel || '',
      });
    }
  }, [existingConfig]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (existingConfig) {
        return slackConfigApi.update(existingConfig.id, formData);
      } else {
        return slackConfigApi.create(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slack-config'] });
      alert('Configuration saved successfully!');
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your workspace integrations</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Slack Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Connect your Slack workspace to enable messaging workflows
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={formData.workspace}
              onChange={(e) => setFormData({ ...formData, workspace: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot User OAuth Token
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="xoxb-your-token-here"
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">🔒</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This token is stored in your app's database. Make sure to use a dedicated bot token
              with limited scopes.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Channel ID
            </label>
            <input
              type="text"
              placeholder="e.g. C123456789"
              value={formData.defaultChannel}
              onChange={(e) => setFormData({ ...formData, defaultChannel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !formData.workspace || !formData.botToken}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saveMutation.isPending ? 'Saving...' : '💾 Save Configuration'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">📘 Getting a Slack Bot Token</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Go to https://api.slack.com/apps</li>
          <li>Create a new app or select an existing one</li>
          <li>Navigate to "OAuth & Permissions"</li>
          <li>Add bot token scopes: chat:write, users:read, im:write</li>
          <li>Install the app to your workspace</li>
          <li>Copy the "Bot User OAuth Token"</li>
        </ol>
      </div>
    </div>
  );
};
