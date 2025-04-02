import { X } from 'lucide-react';
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const GroupNode = ({ data }: NodeProps) => {
  return (
    <div
      className="p-4 bg-blue-200 rounded shadow-md border border-blue-400 relative"
      onClick={data.onClick}>
      <strong>{data.label || 'Group Node'}</strong>
      <button
        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded cursor-pointer"
        onClick={() => data.onDelete?.(data.id)}>
        <X size={16} className="text-white" />
      </button>
      {data.children?.map((childId: string) => (
        <div key={childId} className="p-2 bg-gray-100 rounded mt-2">
          Node {childId}
        </div>
      ))}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
