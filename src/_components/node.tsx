import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { X } from 'lucide-react';

export const Node = ({ data }: NodeProps) => {
  return (
    <div
      className="p-4 bg-gray-100 rounded shadow-md border border-gray-400 relative"
      onClick={data.onClick}>
      <strong>{data.label || 'Simple Node'}</strong>
      <button
        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded cursor-pointer"
        onClick={() => data.onDelete?.(data.id)}>
        <X size={16} className="text-white" />
      </button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
