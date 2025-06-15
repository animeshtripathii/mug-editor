
import React from "react";
import { MousePointer, Move, ZoomIn, ZoomOut } from "lucide-react";
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
  if (!selectedElement) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Select an element to edit its properties</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-9">
              <MousePointer className="w-4 h-4 mr-2" />
              Select
            </Button>
            <Button size="sm" variant="outline" className="h-9">
              <Move className="w-4 h-4 mr-2" />
              Move
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <Button size="sm" variant="outline" className="h-9">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-9">
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
    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 capitalize">
            {selectedElement.type} Editor
          </h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {renderEditor()}
          </div>
          <div>
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
  );
};
