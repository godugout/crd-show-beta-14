import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, FabricText } from 'fabric';
import type { CardData } from '@/hooks/useCardEditor';

interface CanvasProps {
  cardData: CardData;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  className?: string;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
  cardData,
  selectedElement,
  onElementSelect,
  className = ""
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Combine refs
  const combinedRef = (node: HTMLCanvasElement) => {
    canvasRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 560, // 2.5:3.5 aspect ratio for card
      backgroundColor: '#ffffff',
    });

    // Selection events
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        const obj = e.selected[0];
        onElementSelect(obj.get('id') as string || null);
      }
    });

    canvas.on('selection:cleared', () => {
      onElementSelect(null);
    });

    // Add some default elements
    const backgroundRect = new Rect({
      left: 0,
      top: 0,
      width: 400,
      height: 560,
      fill: '#f0f0f0',
      selectable: false,
      evented: false,
      id: 'background'
    });

    const titleText = new FabricText(cardData.title || 'Card Title', {
      left: 20,
      top: 20,
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#000000',
      id: 'title-text'
    });

    const descriptionText = new FabricText(cardData.description || 'Card description...', {
      left: 20,
      top: 60,
      fontSize: 16,
      fontFamily: 'Inter',
      fill: '#666666',
      id: 'description-text'
    });

    canvas.add(backgroundRect);
    canvas.add(titleText);
    canvas.add(descriptionText);

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [cardData.title, cardData.description, onElementSelect]);

  // Handle external selection changes
  useEffect(() => {
    if (!fabricCanvas) return;

    if (selectedElement) {
      const obj = fabricCanvas.getObjects().find(obj => obj.get('id') === selectedElement);
      if (obj) {
        fabricCanvas.setActiveObject(obj);
        fabricCanvas.renderAll();
      }
    } else {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  }, [selectedElement, fabricCanvas]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas 
        ref={combinedRef}
        className="border border-border shadow-lg rounded-lg"
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';