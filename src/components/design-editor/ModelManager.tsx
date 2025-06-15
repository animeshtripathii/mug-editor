import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download } from 'lucide-react';

interface ModelManagerProps {
  onModelChange: (modelPath: string, modelType: 'procedural' | 'gltf') => void;
  currentModel: string | null;
}

export const ModelManager: React.FC<ModelManagerProps> = ({
  onModelChange,
  currentModel
}) => {
  const [uploadedModel, setUploadedModel] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      setUploadedModel(file);
      const url = URL.createObjectURL(file);
      onModelChange(url, 'gltf');
    } else {
      alert('Please upload a .glb or .gltf file');
    }
  };

  const handleUrlSubmit = () => {
    if (modelUrl && (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf'))) {
      onModelChange(modelUrl, 'gltf');
    } else {
      alert('Please enter a valid .glb or .gltf URL');
    }
  };

  const useDefaultModel = () => {
    onModelChange('', 'procedural');
    setUploadedModel(null);
    setModelUrl('');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-gray-900">3D Model Settings</h3>
      
      {/* Current Model Status */}
      <div className="text-sm text-gray-600">
        Current: {currentModel ? 'Custom GLTF Model' : 'Default Procedural Model'}
      </div>

      {/* Default Model Option */}
      <Button 
        variant="outline" 
        onClick={useDefaultModel}
        className="w-full"
      >
        Use Default Mug Model
      </Button>

      {/* File Upload */}
      <div>
        <Label htmlFor="model-upload" className="text-sm font-medium">
          Upload 3D Model (.glb/.gltf)
        </Label>
        <div className="mt-1">
          <Label htmlFor="model-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploadedModel ? uploadedModel.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">GLB, GLTF files only</p>
            </div>
          </Label>
          <input
            id="model-upload"
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* URL Input */}
      <div>
        <Label htmlFor="model-url" className="text-sm font-medium">
          Or enter model URL
        </Label>
        <div className="mt-1 flex gap-2">
          <Input
            id="model-url"
            type="url"
            placeholder="https://example.com/model.glb"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleUrlSubmit} size="sm">
            Load
          </Button>
        </div>
      </div>

      {/* Model Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>Supported formats: GLB, GLTF</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          <span>Max file size: 50MB</span>
        </div>
      </div>

      {/* Future Enhancement Note */}
      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
        💡 Future: Support for animations, materials, and advanced model features
      </div>
    </div>
  );
};