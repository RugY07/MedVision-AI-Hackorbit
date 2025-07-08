import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Move3d, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface OrganModel3DProps {
  organType: string;
  scanData?: any;
  className?: string;
}

export const OrganModel3D: React.FC<OrganModel3DProps> = ({
  organType,
  scanData,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('3d');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw holographic grid background
      drawHolographicGrid(ctx, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw 3D organ model
      drawOrganModel(ctx, canvas.offsetWidth, canvas.offsetHeight);
      
      if (isRotating) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [organType, rotation, zoom, isRotating, scanData]);

  const drawHolographicGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 20;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawOrganModel = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const baseSize = Math.min(width, height) * 0.3 * zoom;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation.y * Math.PI) / 180);

    // Draw organ based on type
    switch (organType) {
      case 'heart':
        drawHeart(ctx, baseSize);
        break;
      case 'brain':
        drawBrain(ctx, baseSize);
        break;
      case 'lungs':
        drawLungs(ctx, baseSize);
        break;
      default:
        drawHeart(ctx, baseSize);
    }

    // Add scan overlay if data exists
    if (scanData) {
      drawScanOverlay(ctx, baseSize);
    }

    ctx.restore();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    // Heart shape with holographic effect
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    const x = 0, y = 0;
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y + size * 0.7, x, y + size * 0.7, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.7, x + size * 0.5, y + size * 0.7, x + size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
    ctx.fill();
    ctx.stroke();
  };

  const drawBrain = (ctx: CanvasRenderingContext2D, size: number) => {
    // Brain shape with neural network effect
    ctx.strokeStyle = '#8b5cf6';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 10;

    // Main brain shape
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size * 0.4, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Brain folds
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.1, size * 0.15, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.1, size * 0.15, 0, Math.PI);
    ctx.stroke();
  };

  const drawLungs = (ctx: CanvasRenderingContext2D, size: number) => {
    // Lung shapes
    ctx.strokeStyle = '#06b6d4';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;

    // Left lung
    ctx.beginPath();
    ctx.ellipse(-size * 0.3, 0, size * 0.25, size * 0.5, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Right lung
    ctx.beginPath();
    ctx.ellipse(size * 0.3, 0, size * 0.25, size * 0.5, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Bronchi
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(-size * 0.1, -size * 0.1);
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(size * 0.1, -size * 0.1);
    ctx.stroke();
  };

  const drawScanOverlay = (ctx: CanvasRenderingContext2D, size: number) => {
    // Scan analysis overlay
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Scanning lines
    const time = Date.now() * 0.001;
    for (let i = 0; i < 3; i++) {
      const y = Math.sin(time + i) * size * 0.3;
      ctx.beginPath();
      ctx.moveTo(-size, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // Analysis points
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.4;
      const y = Math.sin(angle) * size * 0.4;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 3D Canvas */}
      <div className="relative w-full h-full rounded-lg overflow-hidden holographic">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startY = e.clientY;
            const startRotation = { ...rotation };

            const handleMouseMove = (e: MouseEvent) => {
              const deltaX = e.clientX - startX;
              const deltaY = e.clientY - startY;
              
              setRotation({
                x: startRotation.x + deltaY * 0.5,
                y: startRotation.y + deltaX * 0.5
              });
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Organ Info Overlay */}
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {organType.charAt(0).toUpperCase() + organType.slice(1)} Model
          </Badge>
        </div>

        {/* Scan Status Overlay */}
        {scanData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4"
          >
            <Badge className="bg-primary/80 backdrop-blur-sm">
              <Eye className="w-3 h-3 mr-1" />
              Scan Active
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRotating(!isRotating)}
            >
              <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={resetView}>
              <Move3d className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Zoom:</span>
            <div className="w-20">
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};