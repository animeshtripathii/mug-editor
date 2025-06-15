
import React, { useState } from "react";
import { DesignToolbar } from "../components/design-editor/DesignToolbar";
import { DesignCanvas } from "../components/design-editor/DesignCanvas";
import { DesignSidebar } from "../components/design-editor/DesignSidebar";
import { PreviewDialog } from "../components/design-editor/PreviewDialog";
import { Button } from "@/components/ui/button";
import { Eye, Download, ArrowLeft, Undo, Redo, Save } from "lucide-react";
import { Link } from "react-router-dom";

export type DesignElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qr';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  src?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  shape?: string;
  // Extended properties for comprehensive editing
  flipX?: boolean;
  flipY?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  filter?: string;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  qrStyle?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;
  blendMode?: string;
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
  // New advanced properties
  gradient?: string;
  boxShadow?: string;
  qrErrorLevel?: string;
  qrBorder?: number;
  transform?: string;
};

const DesignEditor = () => {
  const [activeTab, setActiveTab] = useState<string>('text');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [threeDModel, setThreeDModel] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<DesignElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Always use horizontal layout - no special case for text
  const useHorizontalLayout = true;

  const addElement = (element: Omit<DesignElement, 'id'>) => {
    // Ensure elements are positioned within canvas bounds (600x450)
    const canvasWidth = 600;
    const canvasHeight = 450;
    
    const constrainedElement = {
      ...element,
      id: Date.now().toString(),
      zIndex: elements.length,
      // Constrain position within canvas bounds
      x: Math.max(0, Math.min(canvasWidth - element.width, element.x)),
      y: Math.max(0, Math.min(canvasHeight - element.height, element.y)),
    };
    
    const newElements = [...elements, constrainedElement];
    setElements(newElements);
    setSelectedElement(constrainedElement.id);
    saveToHistory(newElements);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
    saveToHistory(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(el => el.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: Date.now().toString(),
        x: elementToDuplicate.x + 20,
        y: elementToDuplicate.y + 20,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      setSelectedElement(newElement.id);
      saveToHistory(newElements);
    }
  };

  const saveToHistory = (newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      setSelectedElement(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      setSelectedElement(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">Professional Cup Design Studio</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <Button variant="outline" size="sm" className="text-gray-600">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              3D Preview
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Always Horizontal Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <DesignSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          addElement={addElement}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          threeDModel={threeDModel}
          setThreeDModel={setThreeDModel}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Design Toolbar */}
          <DesignToolbar
            selectedElement={selectedElement ? elements.find(el => el.id === selectedElement) : null}
            updateElement={updateElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
          />
          
          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <DesignCanvas
              elements={elements}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              updateElement={updateElement}
              deleteElement={deleteElement}
              backgroundColor={backgroundColor}
            />
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        elements={elements}
        backgroundColor={backgroundColor}
        threeDModel={threeDModel}
      />
    </div>
  );
};

export default DesignEditor;
