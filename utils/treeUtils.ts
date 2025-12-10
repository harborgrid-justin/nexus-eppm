
export type TreeNode = {
  id: string;
  children: TreeNode[];
  [key: string]: any;
};

export const deepClone = <T,>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error("Deep clone failed", e);
    throw new Error("Failed to clone object: Possible circular reference.");
  }
};

/**
 * Checks if moving targetId to newParentId would create a circular dependency.
 * A cycle exists if newParentId is a descendant of targetId or is targetId itself.
 */
export const detectCircularDependency = <T extends TreeNode>(
  nodes: T[],
  targetId: string,
  newParentId: string | null
): boolean => {
  if (newParentId === null) return false; // Moving to root is always safe regarding cycles
  if (targetId === newParentId) return true; // Cannot be own parent

  const targetNode = findNodeById(nodes, targetId);
  if (!targetNode) return false; // Node doesn't exist?

  // Check if newParentId is a child of targetNode
  const isDescendant = findNodeById(targetNode.children as T[], newParentId);
  return !!isDescendant;
};

export const findNodeById = <T extends TreeNode>(nodes: T[], nodeId: string): T | null => {
  if (!nodes || !Array.isArray(nodes)) return null;
  
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children as T[], nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
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
): { newNodes: T[], movedNode: T | null, error?: string } => {
  
  // Validation: Check for circular dependency
  if (detectCircularDependency(nodes, targetId, newParentId)) {
    const errorMsg = `Circular dependency detected: Cannot move ${targetId} into ${newParentId}`;
    console.error(errorMsg);
    return { newNodes: nodes, movedNode: null, error: errorMsg };
  }

  let movedNode: T | null = null;
  
  // Create a deep copy to ensure immutability
  const tempNodes = deepClone(nodes);

  // Helper to remove the node from its current position
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

  if (!movedNode) return { newNodes: nodes, movedNode: null, error: "Node not found" };

  if (newParentId === null) { // Dropped on root
    return { newNodes: [...nodesWithoutTarget, movedNode], movedNode };
  }

  // Helper to insert the node at the new position
  let parentFound = false;
  const addNode = (currentNodes: T[]): T[] => {
    return currentNodes.map(node => {
      if (node.id === newParentId) {
        parentFound = true;
        // Ensure children array exists
        const children = node.children ? [...node.children] : [];
        // Prevent duplicates just in case
        if (!children.find(c => c.id === movedNode!.id)) {
             children.push(movedNode!);
        }
        return { ...node, children };
      } else if (node.children) {
        return { ...node, children: addNode(node.children as T[]) };
      }
      return node;
    });
  };

  const finalNodes = addNode(nodesWithoutTarget);

  if (newParentId !== null && !parentFound) {
      return { newNodes: nodes, movedNode: null, error: "Target parent node not found" };
  }

  return { newNodes: finalNodes, movedNode };
};
