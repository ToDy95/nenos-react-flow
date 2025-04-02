'use client';
import React, { useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GroupNode } from './group-node';
import { Node } from './node';
import { Button } from './button';

const nodeTypes = { group: GroupNode, default: Node };

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [actionMode, setActionMode] = useState<
    'addNodeBetween' | 'addGroupBetween' | null
  >(null);

  const onConnect = React.useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );
  const removeNode = React.useCallback(
    (id: string) => {
      setNodes(nds => nds.filter(node => node.id !== id));
      setEdges(eds =>
        eds.filter(edge => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  const addNodeBetween = React.useCallback(
    (selectedNodes: string[]) => {
      const [sourceId, targetId] = selectedNodes;
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);

      if (!sourceNode || !targetNode) {
        alert('Selected nodes not found.');
        return;
      }

      const id = `${nodes.length + 1}`;
      const newNode = {
        id,
        type: 'default',
        position: {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        },
        data: {
          id,
          label: `Node ${id}`,
          onDelete: removeNode,
        },
      };

      setNodes(nds => [...nds, newNode]);
      setEdges(eds => [
        ...eds,
        {
          id: `e${sourceId}-${id}-${Date.now()}`,
          source: sourceId,
          target: id,
        },
        {
          id: `e${id}-${targetId}-${Date.now()}`,
          source: id,
          target: targetId,
        },
      ]);

      setSelectedNodes([]);
      setActionMode(null);
    },
    [nodes, setNodes, setEdges]
  );

  const addGroupBetween = React.useCallback(
    (selectedNodes: string[]) => {
      const [sourceId, targetId] = selectedNodes;
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);

      if (!sourceNode || !targetNode) {
        alert('Selected nodes not found.');
        return;
      }

      const id = `${nodes.length + 1}`;
      const groupPosition = {
        x: (sourceNode.position.x + targetNode.position.x) / 2 - 50,
        y: (sourceNode.position.y + targetNode.position.y) / 2 - 50,
      };

      const newGroupNode = {
        id,
        type: 'group',
        position: groupPosition,
        data: {
          id,
          label: `Group ${id}`,
          onDelete: removeNode,
          children: [sourceId, targetId],
        },
      };

      setNodes(nds => [...nds, newGroupNode]);
      setEdges(eds => [
        ...eds,
        {
          id: `e${sourceId}-${id}-${Date.now()}`,
          source: sourceId,
          target: id,
        },
        {
          id: `e${id}-${targetId}-${Date.now()}`,
          source: id,
          target: targetId,
        },
      ]);
    },
    [nodes, setNodes, setEdges, removeNode]
  );

  const handleNodeClick = React.useCallback(
    (id: string) => {
      if (!actionMode) return;

      setSelectedNodes(prev => {
        const updatedSelection = prev.includes(id)
          ? prev.filter(nodeId => nodeId !== id)
          : [...prev, id].slice(-2);

        console.log('Updated Selection:', updatedSelection);

        if (updatedSelection.length === 2) {
          switch (actionMode) {
            case 'addNodeBetween':
              addNodeBetween(updatedSelection);
              break;
            case 'addGroupBetween':
              addGroupBetween(updatedSelection);
              break;
            default:
              break;
          }

          setTimeout(() => {
            setSelectedNodes([]);
            setActionMode(null);
          }, 0);
        }

        return updatedSelection;
      });
    },
    [actionMode, addNodeBetween, addGroupBetween]
  );

  const addNode = (type: string) => {
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: {
        id,
        label: type === 'group' ? `Group ${id}` : `Node ${id}`,
        onDelete: removeNode,
        children: type === 'group' ? [] : undefined,
      },
    };
    setNodes(nds => [...nds, newNode]);
  };

  const processedNodes = React.useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onClick: () => {
          console.log('Node clicked:', node.id);
          handleNodeClick(node.id);
        },
      },
      style: {
        border: selectedNodes.includes(node.id)
          ? '1px solid #d3d3d3'
          : undefined,
      },
    }));
  }, [nodes, selectedNodes]);

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2 bg-gray-100 flex   justify-between">
        <div className="flex gap-8">
          <Button
            text="Add Node"
            onClick={() => addNode('default')}
            variant="default"
          />
          <Button
            text="Add Node Between"
            onClick={() => setActionMode('addNodeBetween')}
            variant="addNodeBetween"
          />
        </div>

        <div className="flex gap-8">
          <Button
            text="Add Group"
            onClick={() => addNode('group')}
            variant="addGroup"
          />
          <Button
            text="Add Group Between"
            onClick={() => setActionMode('addGroupBetween')}
            variant="addGroupBetween"
          />
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={processedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flow;
