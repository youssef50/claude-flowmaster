import React from 'react';
import { Handle, Position } from 'reactflow';

interface SendSlackMessageNodeProps {
  data: {
    label: string;
    channel?: string;
  };
}

export const SendSlackMessageNode: React.FC<SendSlackMessageNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          {data.channel && (
            <div className="text-xs text-gray-500">#{data.channel}</div>
          )}
        </div>
      </div>
    </div>
  );
};
