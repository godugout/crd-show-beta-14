import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Layers,
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Image,
  Sparkles,
  Mountain,
  Camera
} from 'lucide-react';

interface SceneHierarchyPanelProps {
  workspaceMode: string;
  deviceType: string;
}

interface HierarchyNode {
  id: string;
  name: string;
  type: 'group' | 'object' | 'light' | 'camera' | 'effect';
  visible: boolean;
  locked: boolean;
  expanded?: boolean;
  children?: HierarchyNode[];
  depth: number;
}

const MOCK_HIERARCHY: HierarchyNode[] = [
  {
    id: 'scene',
    name: 'Scene',
    type: 'group',
    visible: true,
    locked: false,
    expanded: true,
    depth: 0,
    children: [
      {
        id: 'card-group',
        name: 'Card',
        type: 'group',
        visible: true,
        locked: false,
        expanded: true,
        depth: 1,
        children: [
          {
            id: 'card-mesh',
            name: 'Card Mesh',
            type: 'object',
            visible: true,
            locked: false,
            depth: 2
          },
          {
            id: 'card-frame',
            name: 'Frame',
            type: 'object',
            visible: true,
            locked: false,
            depth: 2
          }
        ]
      },
      {
        id: 'effects-group',
        name: 'Effects',
        type: 'group',
        visible: true,
        locked: false,
        expanded: false,
        depth: 1,
        children: [
          {
            id: 'glow-effect',
            name: 'Cosmic Glow',
            type: 'effect',
            visible: true,
            locked: false,
            depth: 2
          },
          {
            id: 'particles',
            name: 'Particle System',
            type: 'effect',
            visible: false,
            locked: false,
            depth: 2
          }
        ]
      },
      {
        id: 'lighting-group',
        name: 'Lighting',
        type: 'group',
        visible: true,
        locked: false,
        expanded: false,
        depth: 1,
        children: [
          {
            id: 'key-light',
            name: 'Key Light',
            type: 'light',
            visible: true,
            locked: false,
            depth: 2
          },
          {
            id: 'fill-light',
            name: 'Fill Light',
            type: 'light',
            visible: true,
            locked: false,
            depth: 2
          }
        ]
      },
      {
        id: 'camera',
        name: 'Main Camera',
        type: 'camera',
        visible: true,
        locked: true,
        depth: 1
      }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'group': return Layers;
    case 'object': return Image;
    case 'effect': return Sparkles;
    case 'light': return Mountain;
    case 'camera': return Camera;
    default: return Layers;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'group': return 'text-blue-500';
    case 'object': return 'text-green-500';
    case 'effect': return 'text-purple-500';
    case 'light': return 'text-yellow-500';
    case 'camera': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

export const SceneHierarchyPanel: React.FC<SceneHierarchyPanelProps> = ({
  workspaceMode,
  deviceType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('card-mesh');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['scene', 'card-group']));

  const isCompact = deviceType === 'mobile' || workspaceMode === 'beginner';
  const showAdvanced = workspaceMode === 'director';

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const flattenHierarchy = (nodes: HierarchyNode[], result: HierarchyNode[] = []): HierarchyNode[] => {
    for (const node of nodes) {
      result.push(node);
      if (node.children && expandedNodes.has(node.id)) {
        flattenHierarchy(node.children, result);
      }
    }
    return result;
  };

  const filteredNodes = flattenHierarchy(MOCK_HIERARCHY).filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const HierarchyItem = ({ node }: { node: HierarchyNode }) => {
    const Icon = getTypeIcon(node.type);
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 rounded cursor-pointer hover:bg-muted/50 group transition-colors",
          isSelected && "bg-primary/10 border border-primary/20"
        )}
        style={{ paddingLeft: `${node.depth * 12 + 4}px` }}
        onClick={() => setSelectedNode(node.id)}
      >
        {/* Expand/Collapse Button */}
        <div className="w-4 h-4 flex items-center justify-center">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
              className="w-3 h-3 hover:bg-muted rounded"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Type Icon */}
        <Icon className={cn("w-4 h-4", getTypeColor(node.type))} />

        {/* Name */}
        <span className={cn(
          "text-xs flex-1 truncate",
          !node.visible && "opacity-50 line-through"
        )}>
          {node.name}
        </span>

        {/* Controls */}
        {!isCompact && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle visibility
              }}
              className="w-4 h-4 p-0 hover:text-primary transition-colors"
            >
              {node.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle lock
              }}
              className="w-4 h-4 p-0 hover:text-primary transition-colors"
            >
              {node.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>
            {showAdvanced && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Show context menu
                }}
                className="w-4 h-4 p-0 hover:text-primary transition-colors"
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Scene</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-1 space-y-0.5">
            {filteredNodes.map(node => (
              <HierarchyItem key={node.id} node={node} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Add Actions */}
      {showAdvanced && (
        <div className="p-3 border-t border-border">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
              <Plus className="w-3 h-3" />
              {isCompact ? 'Add' : 'Add Object'}
            </Button>
            {!isCompact && (
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};