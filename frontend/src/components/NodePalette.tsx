import React from 'react';
import { useWorkflowStore } from '../stores/workflowStore';

interface NodeTemplate {
  type: string;
  label: string;
  color: string;
  icon: string;
}

interface NodeCategory {
  title: string;
  nodes: NodeTemplate[];
}

const nodeCategories: NodeCategory[] = [
  {
    title: 'People',
    nodes: [
      { type: 'selectTeam', label: 'Select Team', color: 'blue', icon: '👥' },
      { type: 'selectEngineer', label: 'Select Engineer', color: 'green', icon: '👨‍💻' },
    ],
  },
  {
    title: 'Messaging',
    nodes: [
      { type: 'composeMessage', label: 'Compose Message', color: 'purple', icon: '✍️' },
      { type: 'sendSlackMessage', label: 'Send Slack Message', color: 'red', icon: '💬' },
    ],
  },
];

export const NodePalette: React.FC = () => {
  const { addNode } = useWorkflowStore();

  const handleAddNode = (type: string, label: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label },
    };
    addNode(newNode);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Nodes</h3>
      <div className="space-y-6">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {category.title}
            </h4>
            <div className="space-y-2">
              {category.nodes.map((template) => (
                <button
                  key={template.type}
                  onClick={() => handleAddNode(template.type, template.label)}
                  className="w-full p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-300 text-left text-sm font-medium transition-all flex items-center space-x-3 group"
                >
                  <span className="text-xl">{template.icon}</span>
                  <span className="flex-1 text-gray-700 group-hover:text-indigo-700">
                    {template.label}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColorValue(template.color) }}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    red: '#ef4444',
  };
  return colors[color] || '#000000';
}
