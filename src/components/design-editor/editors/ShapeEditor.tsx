
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, Diamond } from "lucide-react";
import { DesignElement } from "../../../pages/DesignEditor";

type Props = {
  selectedElement: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
};

export const ShapeEditor: React.FC<Props> = ({ selectedElement, updateElement }) => {
  return (
    <div className="space-y-4">
      {/* Shape Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Shape</h4>
        
        <Select
          value={selectedElement.shape || 'rectangle'}
          onValueChange={(value) => updateElement(selectedElement.id, { shape: value })}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle">Rectangle</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
            <SelectItem value="star">Star</SelectItem>
            <SelectItem value="heart">Heart</SelectItem>
            <SelectItem value="diamond">Diamond</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1"
            onClick={() => updateElement(selectedElement.id, { shape: 'star', color: '#FFD700' })}
          >
            <Star className="w-4 h-4 mr-1" />
            Star
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1"
            onClick={() => updateElement(selectedElement.id, { shape: 'heart', color: '#FF69B4' })}
          >
            <Heart className="w-4 h-4 mr-1" />
            Heart
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 flex-1"
            onClick={() => updateElement(selectedElement.id, { shape: 'diamond', color: '#40E0D0' })}
          >
            <Diamond className="w-4 h-4 mr-1" />
            Diamond
          </Button>
        </div>
      </div>

      {/* Fill */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Fill</h4>
        
        <input
          type="color"
          value={selectedElement.color || '#0066cc'}
          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
          className="w-full h-9 rounded border cursor-pointer"
        />
      </div>

      {/* Size */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Size</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Width</label>
            <Input
              type="number"
              value={selectedElement.width}
              onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || selectedElement.width })}
              className="h-9 text-center"
              min="10"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Height</label>
            <Input
              type="number"
              value={selectedElement.height}
              onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || selectedElement.height })}
              className="h-9 text-center"
              min="10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
