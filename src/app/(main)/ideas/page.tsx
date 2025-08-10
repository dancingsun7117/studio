"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Lightbulb, Palette, Eraser, Undo, Redo } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

interface Idea {
  id: number;
  title: string;
  content: string;
}

const IDEAS_STORAGE_KEY = 'ideas_v1';
const IDEAS_DRAWING_STORAGE_KEY = 'ideas_drawing_v1';

const initialIdeas: Idea[] = [
  { id: 1, title: "AI-Powered Project Planner", content: "An AI that takes a project description and generates a full project plan with tasks, timelines, and resource allocation. Could integrate with the academic planner." },
  { id: 2, title: "'Don't Break the Chain' Habit Visualizer", content: "A more visual way to see habit streaks. Maybe a garden that grows as you maintain a habit, and wilts if you miss a day." },
  { id: 3, title: "Personalized Motivation API", content: "An API that serves custom motivational quotes based on my current mood or the task I'm working on. Could be integrated into the dashboard." },
  { id: 4, title: "Network and Connection CRM", content: "A simple CRM to track professional connections, when I last contacted them, and what we talked about. Could be a new tracker." },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [newIdea, setNewIdea] = useState({ title: '', content: '' });

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#B8860B');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
      if (savedIdeas) {
        setIdeas(JSON.parse(savedIdeas));
      }
    } catch (error) {
      console.error("Failed to parse ideas from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
        try {
            localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
        } catch (error) {
            console.error("Failed to save ideas to localStorage", error);
        }
    }
  }, [ideas, isClient]);

   useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isClient) {
      const context = canvas.getContext('2d');
      if (context) {
        const savedDrawing = localStorage.getItem(IDEAS_DRAWING_STORAGE_KEY);
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
    localStorage.setItem(IDEAS_DRAWING_STORAGE_KEY, dataUrl);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      saveToHistory(dataUrl);
      localStorage.setItem(IDEAS_DRAWING_STORAGE_KEY, dataUrl);
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
            localStorage.setItem(IDEAS_DRAWING_STORAGE_KEY, image.src);
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
            localStorage.setItem(IDEAS_DRAWING_STORAGE_KEY, image.src);
        };
        image.src = history[newIndex];
      }
    }
  };

  const addIdea = () => {
    if (newIdea.title.trim() || newIdea.content.trim()) {
      const nextId = ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
      setIdeas([{ id: nextId, ...newIdea }, ...ideas]);
      setNewIdea({ title: '', content: '' });
    }
  };

  const handleIdeaChange = (id: number, field: 'title' | 'content', value: string) => {
    setIdeas(ideas.map(idea => (idea.id === id ? { ...idea, [field]: value } : idea)));
  };

  const deleteIdea = (id: number) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary flex items-center gap-3">
          <Lightbulb className="h-10 w-10" />
          Idea Repository
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Capture your sparks of genius. A private vault for your next big moves.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold text-primary">New Idea</h2>
            <Card>
                <CardContent className="p-4 space-y-2">
                    <Input 
                    placeholder="New idea title..." 
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                    className="font-bold text-lg"
                    />
                    <Textarea 
                    placeholder="Describe your idea..." 
                    value={newIdea.content}
                    onChange={(e) => setNewIdea({...newIdea, content: e.target.value})}
                    className="italic"
                    />
                    <Button onClick={addIdea} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Idea
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4 pt-4">
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
        
        <div className="space-y-4">
           <h2 className="font-headline text-2xl font-bold text-primary">Captured Ideas</h2>
            <div className="columns-1 md:columns-2 gap-4 space-y-4 h-[75vh] overflow-y-auto pr-2">
            {ideas.map((idea) => (
                <Card key={idea.id} className="group break-inside-avoid relative bg-secondary/10 border-secondary/20">
                <CardContent className="p-4 space-y-2">
                    <Input
                    value={idea.title}
                    onChange={(e) => handleIdeaChange(idea.id, 'title', e.target.value)}
                    className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 font-headline text-lg font-bold text-primary"
                    />
                    <Textarea
                    value={idea.content}
                    onChange={(e) => handleIdeaChange(idea.id, 'content', e.target.value)}
                    className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-foreground/80"
                    rows={4}
                    />
                </CardContent>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteIdea(idea.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                </Card>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
