
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { DesignElement } from "../../pages/DesignEditor";

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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF proof
              </Button>
              <span className="text-sm text-gray-500">Drag to rotate</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="relative">
            {/* 3D Mug Preview */}
            <div className="w-96 h-96 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg flex items-center justify-center relative">
              <div 
                className="w-64 h-80 rounded-lg shadow-lg relative"
                style={{ 
                  background: `linear-gradient(45deg, ${backgroundColor} 0%, #cc0000 100%)`,
                  transform: 'perspective(1000px) rotateY(-15deg)'
                }}
              >
                {/* Handle */}
                <div 
                  className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-16 border-4 rounded-full"
                  style={{ borderColor: backgroundColor }}
                />
                
                {/* Design Elements on Mug */}
                <div className="absolute inset-4">
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      style={{
                        position: 'absolute',
                        left: `${(element.x / 800) * 100}%`,
                        top: `${(element.y / 600) * 100}%`,
                        width: `${(element.width / 800) * 100}%`,
                        height: `${(element.height / 600) * 100}%`,
                        transform: `rotate(${element.rotation}deg) scale(0.8)`,
                        fontSize: element.fontSize ? `${element.fontSize * 0.8}px` : undefined,
                        color: element.color,
                        fontFamily: element.fontFamily,
                      }}
                    >
                      {element.type === 'text' && element.content}
                      {element.type === 'image' && (
                        <img 
                          src={element.src} 
                          alt="Design" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {element.type === 'shape' && (
                        <div 
                          className={`w-full h-full ${element.shape === 'circle' ? 'rounded-full' : ''}`}
                          style={{ backgroundColor: element.color }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Front/Back Toggle */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                Front
              </Button>
              <Button variant="ghost" size="sm">
                Back
              </Button>
            </div>
          </div>
        </div>

        {threeDModel && (
          <div className="px-6 py-2 border-t text-sm text-green-600">
            3D Model ready for surface mapping: {threeDModel.name}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
