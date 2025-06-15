import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff, RotateCw, FlipHorizontal, FlipVertical, MoveUp, MoveDown, RotateCcw } from "lucide-react";
import { DesignElement } from "../../../pages/DesignEditor";

type Props = {
  selectedElement: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
};

export const CommonActions: React.FC<Props> = ({ 
  selectedElement, 
  updateElement, 
  deleteElement, 
  duplicateElement 
}) => {
  const rotateElement = () => {
    const currentRotation = selectedElement.rotation || 0;
    updateElement(selectedElement.id, { rotation: (currentRotation + 90) % 360 });
  };

  const rotateElementReverse = () => {
    const currentRotation = selectedElement.rotation || 0;
    updateElement(selectedElement.id, { rotation: (currentRotation - 90 + 360) % 360 });
  };

  const flipHorizontal = () => {
    const currentFlipX = selectedElement.flipX || false;
    updateElement(selectedElement.id, { flipX: !currentFlipX });
  };

  const flipVertical = () => {
    const currentFlipY = selectedElement.flipY || false;
    updateElement(selectedElement.id, { flipY: !currentFlipY });
  };

  const toggleLock = () => {
    updateElement(selectedElement.id, { locked: !selectedElement.locked });
  };

  const toggleVisibility = () => {
    updateElement(selectedElement.id, { visible: selectedElement.visible !== false ? false : true });
  };

  const bringToFront = () => {
    updateElement(selectedElement.id, { zIndex: (selectedElement.zIndex || 0) + 1 });
  };

  const sendToBack = () => {
    updateElement(selectedElement.id, { zIndex: Math.max((selectedElement.zIndex || 0) - 1, 0) });
  };

  return (
    <div className="space-y-4">
      {/* Transform */}
      <div className="bg-gray-50 p-3 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Transform</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="h-8" onClick={rotateElementReverse}>
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={rotateElement}>
            <RotateCw className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={flipHorizontal}>
            <FlipHorizontal className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={flipVertical}>
            <FlipVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Layer */}
      <div className="bg-gray-50 p-3 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Layer</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="h-8" onClick={bringToFront}>
            <MoveUp className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={sendToBack}>
            <MoveDown className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={toggleLock}>
            {selectedElement.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={toggleVisibility}>
            {selectedElement.visible === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-50 p-3 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Actions</h4>
        
        <div className="space-y-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-full"
            onClick={() => duplicateElement(selectedElement.id)}
          >
            <Copy className="w-3 h-3 mr-2" />
            Duplicate
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-full text-red-600 hover:text-red-700"
            onClick={() => deleteElement(selectedElement.id)}
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};