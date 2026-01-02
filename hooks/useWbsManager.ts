
import React, { useState, useMemo, useCallback, useEffect, useTransition } from 'react';
import { useData } from '../context/DataContext';
import { WBSNode, WBSNodeShape } from '../types/project';
import { findNodeById } from '../utils/treeUtils';

export const useWbsManager = (projectId: string) => {
    const { state, dispatch } = useData();
    const [isPending, startTransition] = useTransition();
    
    const project = useMemo(() => state.projects.find(p => p.id === projectId), [state.projects, projectId]);
    const wbsTree = useMemo(() => project?.wbs || [], [project]);

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, nodeId: '' });

    useEffect(() => {
      if (wbsTree.length > 0 && !selectedNodeId) {
        const rootId = wbsTree[0].id;
        startTransition(() => {
            setSelectedNodeId(rootId);
            setOpenNodes(prev => new Set(prev).add(rootId));
        });
      }
    }, [wbsTree, selectedNodeId]);
    
    const selectedNode = useMemo(() => {
        if (!selectedNodeId) return null;
        return findNodeById(wbsTree, selectedNodeId);
    }, [selectedNodeId, wbsTree]);

    const handleNodeClick = useCallback((nodeId: string) => {
      startTransition(() => {
        setSelectedNodeId(nodeId);
      });
    }, []);

    const toggleNode = useCallback((nodeId: string) => {
        startTransition(() => {
            setOpenNodes(prev => {
                const newSet = new Set(prev);
                if (newSet.has(nodeId)) newSet.delete(nodeId);
                else newSet.add(nodeId);
                return newSet;
            });
        });
    }, []);

    const handleAddNode = useCallback((parentId: string | null) => {
        const name = prompt("Enter WBS element name:");
        if (name) {
            startTransition(() => {
                const newNode: WBSNode = { id: `WBS-${Date.now()}`, wbsCode: 'TBD', name, description: '', children: [] };
                dispatch({ type: 'WBS_ADD_NODE', payload: { projectId, parentId, newNode } });
            });
        }
    }, [dispatch, projectId]);

    return {
        project, wbsTree, selectedNode, openNodes, draggedNodeId, contextMenu, isPending,
        handleNodeClick, toggleNode, handleAddNode, 
        handleDragStart: useCallback((e: React.DragEvent, nodeId: string) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', nodeId); setDraggedNodeId(nodeId); }, []),
        handleDragEnd: useCallback(() => setDraggedNodeId(null), []),
        handleDrop: useCallback((e: React.DragEvent, newParentId: string | null) => { e.preventDefault(); e.stopPropagation(); const nodeId = e.dataTransfer.getData('text/plain'); if (nodeId && nodeId !== newParentId) { startTransition(() => dispatch({ type: 'WBS_REPARENT', payload: { projectId, nodeId, newParentId } })); } setDraggedNodeId(null); }, [dispatch, projectId]),
        handleDragOver: useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []),
        handleContextMenu: useCallback((e: React.MouseEvent, nodeId: string) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ visible: true, x: e.clientX, y: e.clientY, nodeId }); }, []),
        closeContextMenu: useCallback(() => setContextMenu({ visible: false, x: 0, y: 0, nodeId: '' }), [])
    };
};
