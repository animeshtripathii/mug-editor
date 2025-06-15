import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { DesignElement } from "../../pages/DesignEditor";
import { Advanced3DPreview } from "./Advanced3DPreview";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elements: DesignElement[];
  backgroundColor: string;
  threeDModel: File | null;
};

export const PreviewDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  elements,
  backgroundColor,
  threeDModel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">3D Mug Preview</DialogTitle>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6">
          <div className="w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden">
            <Advanced3DPreview
              elements={elements}
              backgroundColor={backgroundColor}
              canvasWidth={600}
              canvasHeight={450}
              modelType="procedural"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{elements.length}</span> design elements mapped to surface
            </div>
            {threeDModel && (
              <div className="text-sm text-green-600 font-medium">
                Custom 3D model: {threeDModel.name}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Drag to rotate • Scroll to zoom</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};