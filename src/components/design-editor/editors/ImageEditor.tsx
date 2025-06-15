
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Crop, Replace } from "lucide-react";
import { DesignElement } from "../../../pages/DesignEditor";

type Props = {
  selectedElement: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
};

export const ImageEditor: React.FC<Props> = ({ selectedElement, updateElement }) => {
  return (
    <div className="space-y-4">
      {/* Image Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Image</h4>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-9 flex-1">
            <Replace className="w-4 h-4 mr-2" />
            Replace
          </Button>
          <Button size="sm" variant="outline" className="h-9 flex-1">
            <Crop className="w-4 h-4 mr-2" />
            Crop
          </Button>
        </div>
      </div>

      {/* Size Controls */}
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

      {/* Adjustments */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Adjustments</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-2">Hue</label>
            <Slider
              value={[0]}
              onValueChange={(value) => {
                const currentFilter = selectedElement.filter || '';
                const filters = currentFilter.split(' ').filter(f => !f.includes('hue-rotate'));
                filters.push(`hue-rotate(${value[0]}deg)`);
                updateElement(selectedElement.id, { filter: filters.join(' ').trim() });
              }}
              max={360}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-2">Saturation</label>
            <Slider
              value={[1]}
              onValueChange={(value) => {
                const currentFilter = selectedElement.filter || '';
                const filters = currentFilter.split(' ').filter(f => !f.includes('saturate'));
                filters.push(`saturate(${value[0]})`);
                updateElement(selectedElement.id, { filter: filters.join(' ').trim() });
              }}
              max={3}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-2">Brightness</label>
            <Slider
              value={[1]}
              onValueChange={(value) => {
                const currentFilter = selectedElement.filter || '';
                const filters = currentFilter.split(' ').filter(f => !f.includes('brightness'));
                filters.push(`brightness(${value[0]})`);
                updateElement(selectedElement.id, { filter: filters.join(' ').trim() });
              }}
              max={3}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Effects */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Effects</h4>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1">Blend Mode</label>
          <Select
            value={selectedElement.blendMode || 'normal'}
            onValueChange={(value) => updateElement(selectedElement.id, { blendMode: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="screen">Screen</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-2">Opacity</label>
          <Slider
            value={[(selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100]}
            onValueChange={(value) => updateElement(selectedElement.id, { opacity: value[0] / 100 })}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Border */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Border</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Width</label>
            <Input
              type="number"
              value={selectedElement.borderWidth || 0}
              onChange={(e) => updateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) || 0 })}
              className="h-9 text-center"
              min="0"
              max="20"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Color</label>
            <input
              type="color"
              value={selectedElement.borderColor || '#000000'}
              onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
              className="w-full h-9 rounded border cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
