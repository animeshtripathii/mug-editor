import React, { useRef, useState } from "react";
import { DesignElement } from "../../pages/DesignEditor";

type Props = {
  elements: DesignElement[];
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  backgroundColor: string;
};

export const DesignCanvas: React.FC<Props> = ({
  elements,
  selectedElement,
  setSelectedElement,
  updateElement,
  deleteElement,
  backgroundColor,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editingText, setEditingText] = useState<string | null>(null);

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Element clicked:', elementId);
    setSelectedElement(elementId);
  };

  const handleTextDoubleClick = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Text double-clicked for editing:', elementId);
    setEditingText(elementId);
  };

  const handleTextInputChange = (elementId: string, newContent: string) => {
    updateElement(elementId, { content: newContent });
  };

  const handleTextInputBlur = () => {
    setEditingText(null);
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingText(null);
    } else if (e.key === 'Escape') {
      setEditingText(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Canvas clicked - deselecting');
      setSelectedElement(null);
      setEditingText(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedElement && !editingText) {
      deleteElement(selectedElement);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mouse down on element:', elementId, action);
    setSelectedElement(elementId);
    
    if (action === 'drag') {
      setIsDragging(true);
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeHandle(handle || null);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElement || (!isDragging && !isResizing)) return;

    const element = elements.find(el => el.id === selectedElement);
    if (!element || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isDragging) {
      const newX = Math.max(0, Math.min(canvasRect.width - element.width, element.x + deltaX));
      const newY = Math.max(0, Math.min(canvasRect.height - element.height, element.y + deltaY));
      
      updateElement(selectedElement, {
        x: newX,
        y: newY,
      });
    } else if (isResizing && resizeHandle) {
      let updates: Partial<DesignElement> = {};
      
      switch (resizeHandle) {
        case 'nw':
          updates = {
            x: Math.max(0, element.x + deltaX),
            y: Math.max(0, element.y + deltaY),
            width: Math.max(20, element.width - deltaX),
            height: Math.max(20, element.height - deltaY),
          };
          break;
        case 'ne':
          updates = {
            y: Math.max(0, element.y + deltaY),
            width: Math.max(20, element.width + deltaX),
            height: Math.max(20, element.height - deltaY),
          };
          break;
        case 'sw':
          updates = {
            x: Math.max(0, element.x + deltaX),
            width: Math.max(20, element.width - deltaX),
            height: Math.max(20, element.height + deltaY),
          };
          break;
        case 'se':
          updates = {
            width: Math.max(20, element.width + deltaX),
            height: Math.max(20, element.height + deltaY),
          };
          break;
        case 'n':
          updates = {
            y: Math.max(0, element.y + deltaY),
            height: Math.max(20, element.height - deltaY),
          };
          break;
        case 's':
          updates = {
            height: Math.max(20, element.height + deltaY),
          };
          break;
        case 'w':
          updates = {
            x: Math.max(0, element.x + deltaX),
            width: Math.max(20, element.width - deltaX),
          };
          break;
        case 'e':
          updates = {
            width: Math.max(20, element.width + deltaX),
          };
          break;
      }
      
      updateElement(selectedElement, updates);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const generateQRCodeSVG = (content: string, size: number = 100) => {
    if (!content) return '';
    
    const qrSize = 25;
    const moduleSize = size / qrSize;
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="white"/>`;
    
    const hash = content.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const addFinderPattern = (x: number, y: number) => {
      svg += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${7 * moduleSize}" height="${7 * moduleSize}" fill="black"/>`;
      svg += `<rect x="${(x + 1) * moduleSize}" y="${(y + 1) * moduleSize}" width="${5 * moduleSize}" height="${5 * moduleSize}" fill="white"/>`;
      svg += `<rect x="${(x + 2) * moduleSize}" y="${(y + 2) * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" fill="black"/>`;
    };
    
    addFinderPattern(0, 0);
    addFinderPattern(18, 0);
    addFinderPattern(0, 18);
    
    for (let i = 0; i < qrSize; i++) {
      for (let j = 0; j < qrSize; j++) {
        if ((i < 9 && j < 9) || (i < 9 && j > 15) || (i > 15 && j < 9)) continue;
        
        const shouldFill = (hash + i * qrSize + j) % 2 === 0;
        if (shouldFill) {
          svg += `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const renderSelectionHandles = (elementId: string) => {
    const handleStyle = "absolute w-3 h-3 border-2 border-white shadow-md cursor-pointer bg-blue-500 rounded-full";
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={`${handleStyle} -top-1.5 -left-1.5 cursor-nw-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'nw')}
        />
        <div 
          className={`${handleStyle} -top-1.5 -right-1.5 cursor-ne-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'ne')}
        />
        <div 
          className={`${handleStyle} -bottom-1.5 -left-1.5 cursor-sw-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'sw')}
        />
        <div 
          className={`${handleStyle} -bottom-1.5 -right-1.5 cursor-se-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'se')}
        />
        
        <div 
          className={`${handleStyle} -top-1.5 left-1/2 transform -translate-x-1/2 bg-green-500 cursor-n-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'n')}
        />
        <div 
          className={`${handleStyle} -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-green-500 cursor-s-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 's')}
        />
        <div 
          className={`${handleStyle} -left-1.5 top-1/2 transform -translate-y-1/2 bg-green-500 cursor-w-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'w')}
        />
        <div 
          className={`${handleStyle} -right-1.5 top-1/2 transform -translate-y-1/2 bg-green-500 cursor-e-resize pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'resize', 'e')}
        />
        
        <div 
          className={`${handleStyle} -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 cursor-pointer pointer-events-auto`}
          onMouseDown={(e) => handleMouseDown(e, elementId, 'drag')}
        />
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-purple-300" />
      </div>
    );
  };

  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElement === element.id;
    const isEditingThisText = editingText === element.id;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      // Combine rotation, flip, and custom transform
      transform: `rotate(${element.rotation || 0}deg) ${element.flipX ? 'scaleX(-1)' : ''} ${element.flipY ? 'scaleY(-1)' : ''} ${element.transform || ''}`,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      boxShadow: isSelected ? '0 0 0 1px rgba(59, 130, 246, 0.3)' : element.boxShadow || 'none',
      pointerEvents: 'auto',
      opacity: element.opacity !== undefined ? element.opacity : 1,
      visibility: element.visible === false ? 'hidden' : 'visible',
      zIndex: element.zIndex || 0,
    };

    const handleElementMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSelected) {
        handleElementClick(e, element.id);
      } else if (!isEditingThisText) {
        handleMouseDown(e, element.id, 'drag');
      }
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              color: element.color,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              fontWeight: element.bold ? 'bold' : 'normal',
              fontStyle: element.italic ? 'italic' : 'normal',
              textDecoration: element.underline ? 'underline' : 'none',
              textAlign: element.textAlign,
              letterSpacing: element.letterSpacing,
              lineHeight: element.lineHeight,
              textShadow: element.textShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: element.gradient || 'transparent',
              padding: '4px',
              userSelect: isEditingThisText ? 'text' : 'none',
            }}
            onMouseDown={handleElementMouseDown}
            onClick={(e) => handleElementClick(e, element.id)}
            onDoubleClick={(e) => handleTextDoubleClick(e, element.id)}
          >
            {isEditingThisText ? (
              <input
                type="text"
                value={element.content || ''}
                onChange={(e) => handleTextInputChange(element.id, e.target.value)}
                onBlur={handleTextInputBlur}
                onKeyDown={handleTextInputKeyDown}
                className="w-full h-full bg-transparent border-none outline-none text-center"
                style={{
                  color: element.color,
                  fontSize: element.fontSize,
                  fontFamily: element.fontFamily,
                  fontWeight: element.bold ? 'bold' : 'normal',
                  fontStyle: element.italic ? 'italic' : 'normal',
                  textDecoration: element.underline ? 'underline' : 'none',
                  textAlign: element.textAlign,
                  letterSpacing: element.letterSpacing,
                  lineHeight: element.lineHeight,
                  textShadow: element.textShadow,
                }}
                autoFocus
              />
            ) : (
              element.content || 'Double-click to edit'
            )}
            {isSelected && !isEditingThisText && renderSelectionHandles(element.id)}
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle, 
              overflow: 'hidden',
              filter: element.filter,
              mixBlendMode: element.blendMode as any,
              border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || '#000000'}` : 'none',
            }}
            onMouseDown={handleElementMouseDown}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            <img
              src={element.src}
              alt="Design element"
              className="w-full h-full object-cover rounded"
              draggable={false}
              style={{ pointerEvents: 'none' }}
            />
            {isSelected && renderSelectionHandles(element.id)}
          </div>
        );

      case 'shape':
        const getShapeStyle = () => {
          const baseShapeStyle = {
            width: '100%',
            height: '100%',
            background: element.gradient || element.color || '#0066cc',
            border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || '#000000'}` : 'none',
          };

          switch (element.shape) {
            case 'circle':
              return { ...baseShapeStyle, borderRadius: '50%' };
            case 'triangle':
              return {
                width: 0,
                height: 0,
                background: 'transparent',
                borderLeft: `${element.width / 2}px solid transparent`,
                borderRight: `${element.width / 2}px solid transparent`,
                borderBottom: `${element.height}px solid ${element.color}`,
                border: 'none',
              };
            case 'star':
              return {
                ...baseShapeStyle,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              };
            case 'heart':
              return {
                ...baseShapeStyle,
                clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")',
              };
            case 'diamond':
              return {
                ...baseShapeStyle,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              };
            case 'arrow':
              return {
                ...baseShapeStyle,
                clipPath: 'polygon(0 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0 80%)',
              };
            case 'hexagon':
              return {
                ...baseShapeStyle,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              };
            default:
              return { ...baseShapeStyle, borderRadius: '8px' };
          }
        };

        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={handleElementMouseDown}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            <div style={getShapeStyle()} />
            {isSelected && renderSelectionHandles(element.id)}
          </div>
        );

      case 'qr':
        const qrCodeImage = generateQRCodeSVG(element.content || 'https://example.com', Math.min(element.width, element.height));
        
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              background: element.backgroundColor || 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              borderRadius: '4px',
              padding: element.qrBorder || 8,
            }}
            onMouseDown={handleElementMouseDown}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            <img 
              src={qrCodeImage} 
              alt="QR Code"
              className="w-full h-full object-contain"
              draggable={false}
              style={{ pointerEvents: 'none' }}
            />
            {isSelected && renderSelectionHandles(element.id)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Canvas Info */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safety Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Bleed</span>
          </div>
        </div>
        <div className="text-gray-400 font-medium">
          Front
        </div>
      </div>

      {/* Rulers */}
      <div className="relative">
        <div className="absolute -top-6 left-8 right-8 h-6 bg-gray-100 border-b border-gray-300">
          <div className="relative h-full">
            {Array.from({ length: 17 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-400"
                style={{ left: `${(i / 16) * 100}%` }}
              >
                {i % 4 === 0 && (
                  <span className="text-xs text-gray-600 absolute -top-4 -left-2">
                    {i * 2.5}cm
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -left-8 top-0 w-8 bg-gray-100 border-r border-gray-300" style={{ height: '450px' }}>
          <div className="relative h-full">
            {Array.from({ length: 11 }, (_, i) => (
              <div
                key={i}
                className="absolute left-0 w-full border-t border-gray-400"
                style={{ top: `${(i / 10) * 100}%` }}
              >
                {i % 2 === 0 && (
                  <span className="text-xs text-gray-600 absolute -left-6 -top-2 transform -rotate-90">
                    {i * 3}cm
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden"
          style={{
            width: '600px',
            height: '450px',
            background: backgroundColor.includes('gradient') ? backgroundColor : backgroundColor,
            pointerEvents: 'auto',
          }}
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          tabIndex={0}
        >
          <div className="absolute inset-6 border-2 border-dashed border-green-400 opacity-40 pointer-events-none rounded" />
          <div className="absolute inset-3 border border-dashed border-blue-400 opacity-30 pointer-events-none" />
          
          {elements.map(renderElement)}
          
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
            Front Side
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span>17.2cm</span>
        <div className="w-4 h-px bg-gray-400"></div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <select className="text-sm border border-gray-300 rounded px-3 py-2 bg-white">
          <option>100%</option>
          <option>75%</option>
          <option>50%</option>
          <option>125%</option>
          <option>150%</option>
          <option>Fit to Screen</option>
        </select>
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
          <span className="text-sm">⚙️</span>
        </button>
        <span className="text-sm text-gray-500">View</span>
      </div>
    </div>
  );
};
