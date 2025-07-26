import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Tool } from '../ProStudio';

interface ToolsPanelProps {
  tools: Tool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const TOOL_CATEGORIES = {
  selection: 'Selection',
  paint: 'Paint',
  text: 'Text',
  shape: 'Shape',
  navigation: 'Navigation'
};

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  tools,
  selectedTool,
  onToolSelect
}) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="h-full bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-800">
        <h3 className="text-xs font-medium text-gray-400 text-center">Tools</h3>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 p-2 space-y-3">
        {Object.entries(groupedTools).map(([category, categoryTools], index) => (
          <div key={category}>
            {index > 0 && <Separator className="bg-gray-800 my-2" />}
            
            <div className="space-y-1">
              {categoryTools.map((tool) => {
                const IconComponent = tool.icon;
                const isSelected = selectedTool === tool.id;
                const isHovered = hoveredTool === tool.id;

                return (
                  <motion.div
                    key={tool.id}
                    className="relative"
                    onHoverStart={() => setHoveredTool(tool.id)}
                    onHoverEnd={() => setHoveredTool(null)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full h-10 p-0 rounded-md transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                          : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                      }`}
                      onClick={() => onToolSelect(tool.id)}
                    >
                      <IconComponent className="w-5 h-5" />
                    </Button>

                    {/* Tooltip */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs whitespace-nowrap pointer-events-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>{tool.name}</span>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {tool.shortcut}
                          </Badge>
                        </div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900" />
                      </motion.div>
                    )}

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tool Settings Indicator */}
      <div className="p-2 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          Press Tab for settings
        </div>
      </div>
    </div>
  );
};