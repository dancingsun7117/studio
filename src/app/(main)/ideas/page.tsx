"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Lightbulb } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Idea {
  id: number;
  title: string;
  content: string;
}

const IDEAS_STORAGE_KEY = 'ideas_v1';

const initialIdeas: Idea[] = [
  { id: 1, title: "AI-Powered Project Planner", content: "An AI that takes a project description and generates a full project plan with tasks, timelines, and resource allocation. Could integrate with the academic planner." },
  { id: 2, title: "'Don't Break the Chain' Habit Visualizer", content: "A more visual way to see habit streaks. Maybe a garden that grows as you maintain a habit, and wilts if you miss a day." },
  { id: 3, title: "Personalized Motivation API", content: "An API that serves custom motivational quotes based on my current mood or the task I'm working on. Could be integrated into the dashboard." },
  { id: 4, title: "Network and Connection CRM", content: "A simple CRM to track professional connections, when I last contacted them, and what we talked about. Could be a new tracker." },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [newIdea, setNewIdea] = useState({ title: '', content: '' });

  useEffect(() => {
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
    try {
      localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
    } catch (error) {
      console.error("Failed to save ideas to localStorage", error);
    }
  }, [ideas]);

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

      <div className="space-y-4">
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

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
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
  );
}
