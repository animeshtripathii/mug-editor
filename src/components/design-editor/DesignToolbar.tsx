import React, { useState } from "react";
import { MousePointer, Move, ZoomIn, ZoomOut, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignElement } from "../../pages/DesignEditor";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { ShapeEditor } from "./editors/ShapeEditor";
import { QREditor } from "./editors/QREditor";
import { CommonActions } from "./editors/CommonActions";

type Props = {
  selectedElement: DesignElement | null;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
};

export const DesignToolbar: React.FC<Props> = ({ 
  selectedElement, 
  updateElement, 
  deleteElement, 
  duplicateElement 
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (!selectedElement) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Select an element to edit its properties</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8">
              <MousePointer className="w-4 h-4 mr-2" />
              Select
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <Move className="w-4 h-4 mr-2" />
              Move
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <Button size="sm" variant="outline" className="h-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderEditor = () => {
    switch (selectedElement.type) {
      case 'text':
        return <TextEditor selectedElement={selectedElement} updateElement={updateElement} />;
      case 'image':
        return <ImageEditor selectedElement={selectedElement} updateElement={updateElement} />;
      case 'shape':
        return <ShapeEditor selectedElement={selectedElement} updateElement={updateElement} />;
      case 'qr':
        return <QREditor selectedElement={selectedElement} updateElement={updateElement} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      {/* Header with Quick Actions */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 capitalize">
            {selectedElement.type} Editor
          </h3>
          
          {/* Quick Action Buttons - Similar to your screenshot */}
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 px-3">
              Replace
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Crop
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Remove BG
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Sharpen
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Adjust
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Effects
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Flip
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3">
              Rotate
            </Button>
            
            {/* More Options Button */}
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-2"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Options Panel */}
      {showMoreOptions && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-6 py-4">
            <div className="flex gap-6 overflow-x-auto">
              <div className="flex-shrink-0 min-w-80">
                {renderEditor()}
              </div>
              <div className="flex-shrink-0 min-w-64">
                <CommonActions
                  selectedElement={selectedElement}
                  updateElement={updateElement}
                  deleteElement={deleteElement}
                  duplicateElement={duplicateElement}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Position and Alignment Controls */}
      <div className="px-6 py-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Position:</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                X: {Math.round(selectedElement.x)} Y: {Math.round(selectedElement.y)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Size:</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                W: {Math.round(selectedElement.width)} H: {Math.round(selectedElement.height)}
              </span>
            </div>
          </div>
          
          {/* Alignment Controls */}
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Center">
              <div className="w-3 h-3 border border-gray-400 flex items-center justify-center">
                <div className="w-1 h-1 bg-gray-400"></div>
              </div>
            </Button>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" title="Middle">
              <div className="w-3 h-3 border border-gray-400 flex items-center justify-center">
                <div className="w-3 h-px bg-gray-400"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};