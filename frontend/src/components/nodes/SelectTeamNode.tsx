import React from 'react';
import { Handle, Position } from 'reactflow';

interface SelectTeamNodeProps {
  data: {
    label: string;
    teamId?: string;
    teamName?: string;
  };
}

export const SelectTeamNode: React.FC<SelectTeamNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          {data.teamName && (
            <div className="text-xs text-gray-500">{data.teamName}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};
