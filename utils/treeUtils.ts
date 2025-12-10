const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

type TreeNode = {
  id: string;
  children: TreeNode[];
};

export const findAndModifyNode = <T extends TreeNode>(
  nodes: T[], 
  targetId: string, 
  modification: (node: T) => T
): T[] => {
  return nodes.map(node => {
    if (node.id === targetId) {
      return modification(node);
    }
    if (node.children && node.children.length > 0) {
      // The type assertion is safe here because T has children of type T[]
      const newChildren = findAndModifyNode(node.children as T[], targetId, modification);
      return { ...node, children: newChildren };
    }
    return node;
  });
};

export const findAndRemoveNode = <T extends TreeNode>(
  nodes: T[], 
  targetId: string
): T[] => {
  return nodes.filter(node => node.id !== targetId).map(node => {
    if (node.children && node.children.length > 0) {
      const newChildren = findAndRemoveNode(node.children as T[], targetId);
      return { ...node, children: newChildren };
    }
    return node;
  });
};

export const findAndReparentNode = <T extends TreeNode>(
  nodes: T[], 
  targetId: string, 
  newParentId: string | null
): { newNodes: T[], movedNode: T | null } => {
  let movedNode: T | null = null;
  const tempNodes = deepClone(nodes);

  const removeNode = (currentNodes: T[]): T[] => {
    return currentNodes.filter(node => {
      if (node.id === targetId) {
        movedNode = deepClone(node);
        return false;
      }
      if (node.children) {
        node.children = removeNode(node.children as T[]);
      }
      return true;
    });
  };
  
  const nodesWithoutTarget = removeNode(tempNodes);

  if (!movedNode) return { newNodes: nodes, movedNode: null };

  if (newParentId === null) { // Dropped on root
    return { newNodes: [...nodesWithoutTarget, movedNode], movedNode };
  }

  const addNode = (currentNodes: T[]): T[] => {
    return currentNodes.map(node => {
      if (node.id === newParentId) {
        node.children = [...(node.children || []), movedNode!];
      } else if (node.children) {
        node.children = addNode(node.children as T[]);
      }
      return node;
    });
  };

  return { newNodes: addNode(nodesWithoutTarget), movedNode };
};

export const findNodeById = <T extends TreeNode>(nodes: T[], nodeId: string): T | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children as T[], nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
