
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Minus, Plus, Type } from "lucide-react";
import { DesignElement } from "../../../pages/DesignEditor";

type Props = {
  selectedElement: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
};

export const TextEditor: React.FC<Props> = ({ selectedElement, updateElement }) => {
  const increaseFontSize = () => {
    const currentSize = selectedElement.fontSize || 16;
    updateElement(selectedElement.id, { fontSize: Math.min(currentSize + 2, 144) });
  };

  const decreaseFontSize = () => {
    const currentSize = selectedElement.fontSize || 16;
    updateElement(selectedElement.id, { fontSize: Math.max(currentSize - 2, 6) });
  };

  return (
    <div className="space-y-4">
      {/* Font Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Font</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Font Family</label>
            <Select
              value={selectedElement.fontFamily || 'Arial'}
              onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Size</label>
            <div className="flex items-center border rounded-md">
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={decreaseFontSize}>
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={selectedElement.fontSize || 16}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                className="h-9 text-center border-0 focus-visible:ring-0"
                min="6"
                max="144"
              />
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={increaseFontSize}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Color</label>
          <input
            type="color"
            value={selectedElement.color || '#000000'}
            onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
            className="w-full h-9 rounded border cursor-pointer"
          />
        </div>
      </div>

      {/* Style Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Style</h4>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant={selectedElement.bold ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { bold: !selectedElement.bold })}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={selectedElement.italic ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { italic: !selectedElement.italic })}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={selectedElement.underline ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { underline: !selectedElement.underline })}
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant={selectedElement.textAlign === 'left' ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { textAlign: 'left' })}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={selectedElement.textAlign === 'center' ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { textAlign: 'center' })}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant={selectedElement.textAlign === 'right' ? "default" : "outline"} 
            className="h-9"
            onClick={() => updateElement(selectedElement.id, { textAlign: 'right' })}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Text Content */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Content</h4>
        <Input
          value={selectedElement.content || ''}
          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
          placeholder="Enter your text"
          className="h-9"
        />
      </div>
    </div>
  );
};
