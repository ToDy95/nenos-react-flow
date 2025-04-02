import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { X } from 'lucide-react';
import { Button } from './button';

export const Node = ({ data }: NodeProps) => {
  return (
    <div
      className="p-4 bg-gray-100 rounded shadow-md border border-gray-400 relative"
      onClick={data.onClick}>
      <strong>{data.label || 'Simple Node'}</strong>
      <Button
        variant="close"
        onClick={() => data.onDelete?.(data.id)}
        icon={<X size={16} className="text-white" />}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
