import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Canvas, PencilBrush, Path } from 'fabric';

export interface GameCanvasRef {
  drawRemoteStroke: (strokeId: string, points: { x: number; y: number }[], color: string, width: number) => void;
  clearCanvas: () => void;
}

interface GameCanvasProps {
  width?: number;
  height?: number;
  onStrokeStart?: (strokeId: string, point: { x: number; y: number }, color: string, width: number) => void;
  onStrokeContinue?: (strokeId: string, point: { x: number; y: number }) => void;
  onStrokeEnd?: (strokeId: string) => void;
  onClearCanvas?: () => void;
}

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

const LINE_WIDTHS = [2, 4, 6, 8, 12, 16, 20];

export const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(function GameCanvas({ 
  width = 800, 
  height = 600,
  onStrokeStart,
  onStrokeContinue,
  onStrokeEnd,
  onClearCanvas,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedWidth, setSelectedWidth] = useState(4);
  const currentStrokeIdRef = useRef<string | null>(null);
  const isDrawingRef = useRef(false);
  const remoteStrokesRef = useRef<Map<string, { points: { x: number; y: number }[]; color: string; width: number }>>(new Map());

  // Gera ID único para o stroke
  const generateStrokeId = () => `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Método para desenhar strokes remotos
  const drawRemoteStroke = useCallback((_strokeId: string, points: { x: number; y: number }[], color: string, width: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || points.length < 2) return;

    // Cria o path a partir dos pontos
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    const path = new Path(pathData, {
      stroke: color,
      strokeWidth: width,
      fill: null,
      selectable: false,
      evented: false,
    });

    canvas.add(path);
    canvas.renderAll();
  }, []);

  // Expõe métodos via ref
  useImperativeHandle(ref, () => ({
    drawRemoteStroke,
    clearCanvas: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      canvas.remove(...canvas.getObjects());
      canvas.renderAll();
      remoteStrokesRef.current.clear();
    },
  }), [drawRemoteStroke]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Inicializa o canvas Fabric.js
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
    });

    // Configura o brush para desenho livre
    const brush = new PencilBrush(canvas);
    brush.color = selectedColor;
    brush.width = selectedWidth;
    canvas.freeDrawingBrush = brush;

    // Evento mouse:down - inicia stroke
    canvas.on('mouse:down', (e) => {
      const scenePoint = e.scenePoint;
      if (!scenePoint) return;
      
      isDrawingRef.current = true;
      const strokeId = generateStrokeId();
      currentStrokeIdRef.current = strokeId;
      
      onStrokeStart?.(
        strokeId,
        { x: scenePoint.x, y: scenePoint.y },
        selectedColor,
        selectedWidth
      );
    });

    // Evento mouse:move - continua stroke
    canvas.on('mouse:move', (e) => {
      if (!isDrawingRef.current || !currentStrokeIdRef.current) return;
      
      const scenePoint = e.scenePoint;
      if (!scenePoint) return;
      
      onStrokeContinue?.(
        currentStrokeIdRef.current,
        { x: scenePoint.x, y: scenePoint.y }
      );
    });

    // Evento mouse:up - finaliza stroke
    canvas.on('mouse:up', () => {
      if (!isDrawingRef.current || !currentStrokeIdRef.current) return;
      
      isDrawingRef.current = false;
      onStrokeEnd?.(currentStrokeIdRef.current);
      currentStrokeIdRef.current = null;
    });

    // Evento path:created - quando um path é criado pelo freeDrawing
    canvas.on('path:created', (e) => {
      const path = e.path;
      if (path) {
        path.set({
          stroke: selectedColor,
          strokeWidth: selectedWidth,
          fill: null,
          selectable: false,
          evented: false,
        });
        canvas.renderAll();
      }
    });

    fabricCanvasRef.current = canvas;
    setIsReady(true);

    // Cleanup ao desmontar
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, onStrokeStart, onStrokeContinue, onStrokeEnd]);

  // Atualiza as propriedades do brush quando mudam
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = selectedWidth;
    }
  }, [selectedColor, selectedWidth]);

  const handleClearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.remove(...canvas.getObjects());
    canvas.renderAll();
    remoteStrokesRef.current.clear();
    onClearCanvas?.();
  }, [onClearCanvas]);

  const handleToggleDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.isDrawingMode = !canvas.isDrawingMode;
    canvas.renderAll();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-3 flex flex-wrap items-center gap-4">
        {/* Cores */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Cor:</span>
          <div className="flex flex-wrap gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ 
                  backgroundColor: color,
                  boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : 'none'
                }}
                title={`Cor ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Espessura */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Espessura:</span>
          <div className="flex items-center gap-1">
            {LINE_WIDTHS.map((width) => (
              <button
                key={width}
                onClick={() => setSelectedWidth(width)}
                className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
                  selectedWidth === width 
                    ? 'bg-blue-100 ring-2 ring-blue-500' 
                    : 'hover:bg-gray-100'
                }`}
                title={`Espessura ${width}px`}
              >
                <div 
                  className="bg-gray-800 rounded-full"
                  style={{ 
                    width: Math.min(width, 16), 
                    height: Math.min(width, 16) 
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleDrawing}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Ativar Desenho
          </button>
          <button
            onClick={handleClearCanvas}
            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ width, height }}
      >
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Inicializando canvas...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block cursor-crosshair"
          style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            touchAction: 'none'
          }}
        />
      </div>

      {/* Instruções */}
      <p className="text-xs text-gray-500 text-center">
        Clique em "Ativar Desenho" e arraste para desenhar. Use a toolbar para mudar cor e espessura.
      </p>
    </div>
  );
});
