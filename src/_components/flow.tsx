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

  const handleNodeClick = (id: string) => {
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
  };

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

  const addNodeBetween = (selectedNodes: string[]) => {
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
      { id: `e${sourceId}-${id}`, source: sourceId, target: id },
      { id: `e${id}-${targetId}`, source: id, target: targetId },
    ]);

    setSelectedNodes([]);
    setActionMode(null);
  };

  const addGroupBetween = (selectedNodes: string[]) => {
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

    setNodes(nds =>
      nds
        .map(node => {
          if (selectedNodes.includes(node.id)) {
            return {
              ...node,
              position: {
                x: node.position.x - groupPosition.x,
                y: node.position.y - groupPosition.y,
              },
              parentNode: id,
            };
          }
          return node;
        })
        .concat(newGroupNode)
    );

    setSelectedNodes([]);
    setActionMode(null);
  };

  const removeNode = (id: string) => {
    setNodes(nds => nds.filter(node => node.id !== id));
    setEdges(eds =>
      eds.filter(edge => edge.source !== id && edge.target !== id)
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2 bg-gray-100 flex   justify-between">
        <div className="flex gap-8">
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => addNode('default')}>
            Add Node
          </button>
          <button
            className={`p-2 ${
              actionMode === 'addNodeBetween'
                ? 'bg-yellow-600'
                : 'bg-yellow-500'
            } text-white rounded`}
            onClick={() => setActionMode('addNodeBetween')}>
            Add Node Between
          </button>
        </div>

        <div className="flex gap-8">
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={() => addNode('group')}>
            Add Group
          </button>
          <button
            className={`p-2 ${
              actionMode === 'addGroupBetween'
                ? 'bg-purple-600'
                : 'bg-purple-500'
            } text-white rounded`}
            onClick={() => setActionMode('addGroupBetween')}>
            Add Group Between
          </button>
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes.map(node => ({
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
          }))}
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
