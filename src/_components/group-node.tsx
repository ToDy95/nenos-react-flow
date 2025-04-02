import { X } from 'lucide-react';
import { Button } from './button';
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const GroupNode = ({ data }: NodeProps) => {
  return (
    <div
      className="p-4 bg-blue-200 rounded shadow-md border border-blue-400 relative"
      onClick={data.onClick}>
      <strong>{data.label || 'Group Node'}</strong>
      <Button
        variant="close"
        onClick={() => data.onDelete?.(data.id)}
        icon={<X size={16} className="text-white" />}
      />
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
