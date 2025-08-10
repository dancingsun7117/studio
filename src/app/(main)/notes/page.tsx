"use client";

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MafiaSealIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Palette, Eraser, Trash2, Undo, Redo } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const NOTES_STORAGE_KEY = 'notes_content_v1';

export default function NotesPage() {
  const [notes, setNotes] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, notes);
      } catch (error) {
        console.error("Failed to save notes to localStorage", error);
      }
    }
  }, [notes, isClient]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const savedDrawing = localStorage.getItem('moodboard_drawing_v1');
        if (savedDrawing) {
          const image = new Image();
          image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            saveToHistory(canvas.toDataURL());
          };
          image.src = savedDrawing;
        } else {
            saveToHistory(canvas.toDataURL());
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  const saveToHistory = (dataUrl: string) => {
    setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(dataUrl);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.lineWidth = brushSize;
    context.strokeStyle = color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
    const dataUrl = canvas.toDataURL();
    saveToHistory(dataUrl);
    localStorage.setItem('moodboard_drawing_v1', dataUrl);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      saveToHistory(dataUrl);
      localStorage.setItem('moodboard_drawing_v1', dataUrl);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        const image = new Image();
        image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            localStorage.setItem('moodboard_drawing_v1', image.src);
        };
        image.src = history[newIndex];
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        const image = new Image();
        image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            localStorage.setItem('moodboard_drawing_v1', image.src);
        };
        image.src = history[newIndex];
      }
    }
  };

  const dotGridStyle = {
    backgroundImage: 
      'radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)',
    backgroundSize: '20px 20px',
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Notes & Schematics
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A secure place for your thoughts, plans, and secret algorithms.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="relative flex-1 flex flex-col">
          <MafiaSealIcon className="absolute bottom-8 right-8 h-32 w-32 text-foreground/5 opacity-50 pointer-events-none" />
          <Textarea
            placeholder="Start typing your master plan..."
            className="h-full min-h-[50vh] w-full resize-none text-lg font-body"
            style={dotGridStyle}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="space-y-4">
           <h2 className="font-headline text-2xl font-bold text-primary">Mood Board</h2>
           <div className="relative aspect-video w-full rounded-lg border bg-muted/20 overflow-hidden" data-ai-hint="canvas drawing">
                {isClient && (
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={450}
                        className="absolute top-0 left-0 h-full w-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                   <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0}><Undo className="h-4 w-4"/></Button>
                    <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}><Redo className="h-4 w-4"/></Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon"><Palette className="h-4 w-4"/></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Color</label>
                                    <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 p-1" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brush Size</label>
                                    <Slider value={[brushSize]} onValueChange={value => setBrushSize(value[0])} min={1} max={50} step={1} />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon" onClick={() => setColor('#FFFFFF')}><Eraser className="h-4 w-4"/></Button>
                    <Button variant="destructive" size="icon" onClick={clearCanvas}><Trash2 className="h-4 w-4"/></Button>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
