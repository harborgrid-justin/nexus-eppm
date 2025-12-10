import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { WBSNode, WBSNodeShape } from '../types';
import { findNodeById } from '../utils/treeUtils';

export const useWbsManager = (projectId: string) => {
    const { state, dispatch } = useData();
    
    const project = useMemo(() => state.projects.find(p => p.id === projectId), [state.projects, projectId]);
    const wbsTree = useMemo(() => project?.wbs || [], [project]);

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, nodeId: '' });

    useEffect(() => {
      if (wbsTree.length > 0 && !selectedNodeId) {
        const rootId = wbsTree[0].id;
        setSelectedNodeId(rootId);
        setOpenNodes(prev => new Set(prev).add(rootId));
      }
    }, [wbsTree, selectedNodeId]);
    
    const selectedNode = useMemo(() => {
        if (!selectedNodeId) return null;
        return findNodeById(wbsTree, selectedNodeId);
    }, [selectedNodeId, wbsTree]);

    const associatedTasks = useMemo(() => {
        if (!selectedNode) return [];
        return project?.tasks.filter(task => task.wbsCode.startsWith(selectedNode.wbsCode)) || [];
    }, [selectedNode, project?.tasks]);

    const handleNodeClick = useCallback((nodeId: string) => {
      setSelectedNodeId(nodeId);
    }, []);

    const toggleNode = useCallback((nodeId: string) => {
        setOpenNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) newSet.delete(nodeId);
            else newSet.add(nodeId);
            return newSet;
        });
    }, []);

    const handleAddNode = useCallback((parentId: string | null) => {
        const name = prompt("Enter WBS element name:");
        if (name) {
            const newNode: WBSNode = {
                id: `WBS-${Date.now()}`,
                wbsCode: 'TBD',
                name,
                description: '',
                children: []
            };
            dispatch({ type: 'ADD_WBS_NODE', payload: { projectId, parentId, newNode } });
        }
    }, [dispatch, projectId]);

    const handleDragStart = useCallback((e: React.DragEvent, nodeId: string) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', nodeId);
        setDraggedNodeId(nodeId);
    }, []);
    
    const handleDragEnd = useCallback(() => {
        setDraggedNodeId(null);
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent, newParentId: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        const nodeId = e.dataTransfer.getData('text/plain');
        if (nodeId && nodeId !== newParentId) {
            dispatch({ type: 'UPDATE_WBS_NODE_PARENT', payload: { projectId, nodeId, newParentId } });
        }
        setDraggedNodeId(null);
    }, [dispatch, projectId]);
    
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, nodeId });
    }, []);

    const closeContextMenu = useCallback(() => {
        if (contextMenu.visible) {
            setContextMenu({ visible: false, x: 0, y: 0, nodeId: '' });
        }
    }, [contextMenu.visible]);
    
    const handleShapeChange = useCallback((shape: WBSNodeShape) => {
        if (contextMenu.nodeId) {
            dispatch({ type: 'UPDATE_WBS_NODE_SHAPE', payload: { projectId, nodeId: contextMenu.nodeId, shape } });
        }
        closeContextMenu();
    }, [dispatch, projectId, contextMenu.nodeId, closeContextMenu]);


    return {
        project,
        wbsTree,
        selectedNode,
        associatedTasks,
        openNodes,
        draggedNodeId,
        contextMenu,
        handleNodeClick,
        toggleNode,
        handleAddNode,
        handleDragStart,
        handleDragEnd,
        handleDrop,
        handleDragOver,
        handleContextMenu,
        closeContextMenu,
        handleShapeChange
    };
};
