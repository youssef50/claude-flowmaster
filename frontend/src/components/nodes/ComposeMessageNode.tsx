import React from 'react';
import { Handle, Position } from 'reactflow';

interface ComposeMessageNodeProps {
  data: {
    label: string;
    messageTemplate?: string;
  };
}

export const ComposeMessageNode: React.FC<ComposeMessageNodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          {data.messageTemplate && (
            <div className="text-xs text-gray-500 truncate max-w-[150px]">
              {data.messageTemplate}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};
