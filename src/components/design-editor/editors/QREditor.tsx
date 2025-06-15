
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DesignElement } from "../../../pages/DesignEditor";

type Props = {
  selectedElement: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
};

export const QREditor: React.FC<Props> = ({ selectedElement, updateElement }) => {
  return (
    <div className="space-y-4">
      {/* URL */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">URL</h4>
        
        <Input
          value={selectedElement.content || ''}
          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
          placeholder="Enter URL"
          className="h-9"
        />

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1 text-xs"
            onClick={() => updateElement(selectedElement.id, { content: 'https://www.google.com' })}
          >
            Google
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1 text-xs"
            onClick={() => updateElement(selectedElement.id, { content: 'https://www.youtube.com' })}
          >
            YouTube
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1 text-xs"
            onClick={() => updateElement(selectedElement.id, { content: 'https://www.facebook.com' })}
          >
            Facebook
          </Button>
        </div>
      </div>

      {/* Size */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Size</h4>
        
        <Input
          type="number"
          value={selectedElement.width}
          onChange={(e) => {
            const size = parseInt(e.target.value) || selectedElement.width;
            updateElement(selectedElement.id, { width: size, height: size });
          }}
          className="h-9 text-center"
          min="50"
          max="400"
        />
      </div>

      {/* Colors */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Colors</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Foreground</label>
            <input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
              className="w-full h-9 rounded border cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Background</label>
            <input
              type="color"
              value={selectedElement.backgroundColor || '#ffffff'}
              onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })}
              className="w-full h-9 rounded border cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
