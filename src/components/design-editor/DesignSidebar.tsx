
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Image, Shapes, Palette, QrCode, Upload, Plus } from "lucide-react";
import { DesignElement } from "../../pages/DesignEditor";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  threeDModel: File | null;
  setThreeDModel: (file: File | null) => void;
};

const shapes = [
  { name: 'Rectangle', value: 'rectangle' },
  { name: 'Circle', value: 'circle' },
  { name: 'Triangle', value: 'triangle' },
  { name: 'Star', value: 'star' },
  { name: 'Heart', value: 'heart' },
  { name: 'Diamond', value: 'diamond' },
];

const presetColors = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
  '#6c757d', '#495057', '#343a40', '#212529', '#000000',
  '#ff0000', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997',
  '#17a2b8', '#007bff', '#6f42c1', '#e83e8c', '#ff69b4',
];

export const DesignSidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  addElement,
  backgroundColor,
  setBackgroundColor,
  threeDModel,
  setThreeDModel,
}) => {
  const [qrUrl, setQrUrl] = useState('https://example.com');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        addElement({
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          rotation: 0,
          src,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handle3DModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThreeDModel(file);
    }
  };

  const addTextElement = () => {
    addElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      content: 'Add your text',
      color: '#000000',
      fontSize: 18,
      fontFamily: 'Arial',
    });
  };

  const addShape = (shape: string) => {
    addElement({
      type: 'shape',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      shape,
      color: '#0066cc',
    });
  };

  const addQRCode = () => {
    if (!qrUrl.trim()) return;
    
    addElement({
      type: 'qr',
      x: 100,
      y: 100,
      width: 120,
      height: 120,
      rotation: 0,
      content: qrUrl,
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5 m-0 rounded-none border-b">
          <TabsTrigger value="text" className="flex flex-col gap-1 py-3">
            <Type className="w-4 h-4" />
            <span className="text-xs">Text</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex flex-col gap-1 py-3">
            <Image className="w-4 h-4" />
            <span className="text-xs">Images</span>
          </TabsTrigger>
          <TabsTrigger value="graphics" className="flex flex-col gap-1 py-3">
            <Shapes className="w-4 h-4" />
            <span className="text-xs">Graphics</span>
          </TabsTrigger>
          <TabsTrigger value="background" className="flex flex-col gap-1 py-3">
            <Palette className="w-4 h-4" />
            <span className="text-xs">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex flex-col gap-1 py-3">
            <QrCode className="w-4 h-4" />
            <span className="text-xs">QR Code</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="text" className="p-6 space-y-6 m-0">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Add Text</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click to add a text field to your design
              </p>
              <Button 
                onClick={addTextElement} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Text
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Text Styles</h4>
              <div className="space-y-2">
                <button className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
                  <div className="font-bold text-lg mb-1">Heading</div>
                  <div className="text-xs text-gray-500">Bold, Large</div>
                </button>
                <button className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
                  <div className="text-base mb-1">Subheading</div>
                  <div className="text-xs text-gray-500">Medium</div>
                </button>
                <button className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors">
                  <div className="text-sm mb-1">Body Text</div>
                  <div className="text-xs text-gray-500">Regular</div>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="p-6 space-y-6 m-0">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Upload Images</h3>
                
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Upload Image</p>
                    <p className="text-xs text-gray-500">JPG, PNG, SVG up to 10MB</p>
                  </div>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">3D Model</h4>
                <Label htmlFor="model-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-700 mb-1">Upload 3D Model</p>
                    {threeDModel && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ {threeDModel.name}
                      </p>
                    )}
                  </div>
                </Label>
                <input
                  id="model-upload"
                  type="file"
                  accept=".obj,.gltf,.glb,.fbx"
                  onChange={handle3DModelUpload}
                  className="hidden"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="graphics" className="p-6 space-y-6 m-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Shapes</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {shapes.map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => addShape(shape.value)}
                    className="aspect-square border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-300 flex flex-col items-center justify-center transition-colors group"
                  >
                    <div className="mb-2">
                      {shape.value === 'rectangle' && <div className="w-8 h-6 bg-gray-700 rounded-sm group-hover:bg-blue-600" />}
                      {shape.value === 'circle' && <div className="w-8 h-8 bg-gray-700 rounded-full group-hover:bg-blue-600" />}
                      {shape.value === 'triangle' && <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-gray-700 group-hover:border-b-blue-600" />}
                      {shape.value === 'star' && <div className="text-gray-700 text-xl group-hover:text-blue-600">★</div>}
                      {shape.value === 'heart' && <div className="text-gray-700 text-xl group-hover:text-blue-600">♥</div>}
                      {shape.value === 'diamond' && <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-b-4 border-l-transparent border-r-transparent border-t-gray-700 border-b-gray-700 group-hover:border-t-blue-600 group-hover:border-b-blue-600" />}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="background" className="p-6 space-y-6 m-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Background Color</h3>
              
              <div className="space-y-4">
                <div 
                  className="w-full h-24 rounded-xl border border-gray-200 shadow-sm"
                  style={{ background: backgroundColor.includes('gradient') ? backgroundColor : backgroundColor }}
                />

                <div className="flex gap-3">
                  <Input
                    value={backgroundColor.includes('gradient') ? '#ffffff' : backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="#ffffff"
                  />
                  <input
                    type="color"
                    value={backgroundColor.includes('gradient') ? '#ffffff' : backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Preset Colors</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {presetColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setBackgroundColor(color)}
                        className="aspect-square rounded-lg border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="p-6 space-y-6 m-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a QR code from a URL
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qr-url" className="text-sm font-medium text-gray-700">
                    Enter URL
                  </Label>
                  <Input
                    id="qr-url"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-2 h-10"
                  />
                </div>
                
                <Button 
                  onClick={addQRCode} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
                  disabled={!qrUrl.trim()}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Generate QR Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
