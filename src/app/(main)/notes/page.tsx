
"use client";

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Palette, Eraser, Trash2, Undo, Redo, PlusCircle, FileText, Upload, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import NextImage from 'next/image';

const NOTES_PAGES_STORAGE_KEY = 'notes_pages_v3';

interface NotePageData {
  id: number;
  title: string;
  content: string;
  drawing: string | null;
  image: string | null;
}

const initialPage: NotePageData = {
    id: 1,
    title: "My First Note",
    content: "Start typing your master plan...",
    drawing: null,
    image: null,
};

export default function NotesPage() {
  const [pages, setPages] = useState<NotePageData[]>([initialPage]);
  const [activePageId, setActivePageId] = useState<number | null>(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#B8860B');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedPages = localStorage.getItem(NOTES_PAGES_STORAGE_KEY);
      if (savedPages) {
        const parsedPages = JSON.parse(savedPages);
        if (parsedPages.length > 0) {
            setPages(parsedPages);
            setActivePageId(parsedPages[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error);
    }
  }, []);

  // Save to localStorage whenever pages change
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(NOTES_PAGES_STORAGE_KEY, JSON.stringify(pages));
      } catch (error) {
        console.error("Failed to save notes to localStorage", error);
      }
    }
  }, [pages, isClient]);
  
  const activePage = pages.find(p => p.id === activePageId);

  // Load canvas drawing for active page
  useEffect(() => {
    if (!isClient || !activePage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    if (activePage.image) return; // Don't initialize canvas if there's an image

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear previous drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawingData = activePage.drawing;
    setHistory([]);
    setHistoryIndex(-1);

    if (drawingData) {
      const image = new window.Image();
      image.onload = () => {
        context.drawImage(image, 0, 0);
        saveToHistory(canvas.toDataURL(), true);
      };
      image.src = drawingData;
    } else {
       saveToHistory(canvas.toDataURL(), true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, isClient]);

  const updatePageData = (pageId: number, updates: Partial<NotePageData>) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, ...updates } : p));
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activePageId) {
        updatePageData(activePageId, { content: e.target.value });
    }
  };

  const handleTitleChange = (pageId: number, title: string) => {
    updatePageData(pageId, { title });
  };
  
  const addNewPage = () => {
    const newId = Date.now();
    const newPage: NotePageData = {
        id: newId,
        title: `New Note ${pages.length + 1}`,
        content: '',
        drawing: null,
        image: null
    };
    setPages([...pages, newPage]);
    setActivePageId(newId);
  };
  
  const deletePage = (pageId: number) => {
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    if (activePageId === pageId) {
        setActivePageId(newPages.length > 0 ? newPages[0].id : null);
    }
  };

  const saveToHistory = (dataUrl: string, initial = false) => {
    if (initial) {
      setHistory([dataUrl]);
      setHistoryIndex(0);
      return;
    }
    setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(dataUrl);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
    });
  };
  
  const updateDrawingForPage = (dataUrl: string) => {
      if(activePageId) {
          updatePageData(activePageId, { drawing: dataUrl });
      }
  };

  const getScaledCoords = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    ];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activePage?.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    const [x, y] = getScaledCoords(e);
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = brushSize;
    context.strokeStyle = color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activePage?.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const [x, y] = getScaledCoords(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (activePage?.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
    const dataUrl = canvas.toDataURL();
    saveToHistory(dataUrl);
    updateDrawingForPage(dataUrl);
  };
  
  const clearCanvas = () => {
    if (activePage?.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      saveToHistory(dataUrl);
      updateDrawingForPage(dataUrl);
    }
  };

  const applyHistoryState = (index: number) => {
     if (activePage?.image) return;
     const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        const image = new window.Image();
        image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            updateDrawingForPage(image.src);
        };
        image.src = history[index];
      }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      applyHistoryState(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      applyHistoryState(newIndex);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activePageId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updatePageData(activePageId, { image: base64String, drawing: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    if (activePageId) {
      updatePageData(activePageId, { image: null });
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
      <div className="grid md:grid-cols-4 gap-8 flex-1">
        {/* Pages Sidebar */}
        <div className="md:col-span-1 space-y-4">
            <h2 className="font-headline text-2xl font-bold text-primary">Your Notes</h2>
            <Button onClick={addNewPage} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> New Page
            </Button>
            <div className="space-y-2 h-[60vh] overflow-y-auto pr-2">
                {pages.map(page => (
                    <Card key={page.id} className={`group cursor-pointer ${activePageId === page.id ? 'border-primary' : 'border-border'}`} onClick={() => setActivePageId(page.id)}>
                        <CardContent className="p-2 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                            <Input 
                                value={page.title}
                                onChange={(e) => handleTitleChange(page.id, e.target.value)}
                                className="flex-1 font-semibold p-0 h-auto border-none bg-transparent focus-visible:ring-0"
                                onFocus={() => setActivePageId(page.id)}
                            />
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); deletePage(page.id)}}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 grid md:grid-cols-2 gap-8">
          {activePage ? (
            <>
              <div className="relative flex-1 flex flex-col min-h-[50vh]">
                <Textarea
                  placeholder="Start typing your master plan..."
                  className="h-full w-full resize-none text-lg font-body"
                  style={dotGridStyle}
                  value={activePage.content}
                  onChange={handleContentChange}
                />
              </div>
              <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold text-primary">Mood Board</h2>
                <div className="relative aspect-video w-full rounded-lg border bg-muted/20 overflow-hidden group" data-ai-hint="canvas drawing">
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    {activePage.image ? (
                        <>
                            <NextImage src={activePage.image} alt="Note mood board" layout="fill" objectFit="cover" className="rounded-lg" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-lg">
                                <Button onClick={triggerImageUpload} variant="outline" size="icon" title="Change Image">
                                    <Upload className="h-5 w-5"/>
                                </Button>
                                <Button onClick={removeImage} variant="destructive" size="icon" title="Remove Image">
                                    <Trash className="h-5 w-5"/>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
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
                                <Button variant="outline" size="icon" onClick={triggerImageUpload} title="Upload Image"><Upload className="h-4 w-4"/></Button>
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
                        </>
                    )}
                </div>
              </div>
            </>
          ) : (
            <div className="md:col-span-2 flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                <FileText className="h-16 w-16 mb-4"/>
                <h2 className="text-xl font-semibold">No note selected</h2>
                <p>Create a new note or select one from the list to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
