
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, GlassWater, Apple, Dumbbell, BookOpen, Sparkles, Smile, Heart, PlusCircle, Trash2, Upload, Trash, HeartHandshake } from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const initialReminders = [
    { id: 1, icon: GlassWater, text: "Drink Water", color: "text-blue-400" },
    { id: 2, icon: Apple, text: "Eat Healthy", color: "text-green-400" },
    { id: 3, icon: Dumbbell, text: "Stay Active", color: "text-red-400" },
    { id: 4, icon: BookOpen, text: "Study Smart", color: "text-yellow-400" },
    { id: 5, icon: Sparkles, text: "Be Confident", color: "text-pink-400" },
    { id: 6, icon: Smile, text: "Stay Positive", color: "text-indigo-400" },
    { id: 7, icon: Heart, text: "You Are Beautiful", color: "text-purple-400" },
];

const iconComponents = [GlassWater, Apple, Dumbbell, BookOpen, Sparkles, Smile, Heart];
const colorClasses = ["text-blue-400", "text-green-400", "text-red-400", "text-yellow-400", "text-pink-400", "text-indigo-400", "text-purple-400"];

const VISION_BOARD_STORAGE_KEY = 'vision_board_image_v1';
const GRATITUDE_STORAGE_KEY = 'gratitude_text_v1';
const MISSION_STATEMENT_STORAGE_KEY = 'mission_statement_v1';

export default function DashboardPage() {
  const { selectedQuote } = useQuote();
  const [reminders, setReminders] = useState(initialReminders);
  const [newReminder, setNewReminder] = useState('');
  const [visionBoardImage, setVisionBoardImage] = useState<string | null>(null);
  const [gratitudeText, setGratitudeText] = useState('');
  const [missionStatement, setMissionStatement] = useState('“In a world full of noise, she codes in silence and conquers in power.”');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedImage = localStorage.getItem(VISION_BOARD_STORAGE_KEY);
      if (savedImage) {
        setVisionBoardImage(savedImage);
      }
      const savedGratitude = localStorage.getItem(GRATITUDE_STORAGE_KEY);
      if (savedGratitude) {
        setGratitudeText(savedGratitude);
      }
      const savedMission = localStorage.getItem(MISSION_STATEMENT_STORAGE_KEY);
      if (savedMission) {
        setMissionStatement(savedMission);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GRATITUDE_STORAGE_KEY, gratitudeText);
    } catch (error) {
      console.error("Failed to save gratitude text to localStorage", error);
    }
  }, [gratitudeText]);
  
  useEffect(() => {
    try {
      localStorage.setItem(MISSION_STATEMENT_STORAGE_KEY, missionStatement);
    } catch (error) {
      console.error("Failed to save mission statement to localStorage", error);
    }
  }, [missionStatement]);

  const addReminder = () => {
    if (newReminder.trim()) {
      const nextId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
      const newReminderObj = {
        id: nextId,
        icon: iconComponents[reminders.length % iconComponents.length],
        text: newReminder,
        color: colorClasses[reminders.length % colorClasses.length],
      };
      setReminders([...reminders, newReminderObj]);
      setNewReminder('');
    }
  };

  const handleReminderChange = (id: number, text: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, text } : r));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem(VISION_BOARD_STORAGE_KEY, base64String);
          setVisionBoardImage(base64String);
        } catch (error) {
          console.error("Failed to save vision board image to localStorage", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    try {
      localStorage.removeItem(VISION_BOARD_STORAGE_KEY);
      setVisionBoardImage(null);
    } catch (error) {
      console.error("Failed to remove vision board image from localStorage", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This is your command center. Track your progress, plan your conquests, and build your empire, one line of code at a time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/50 bg-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body text-primary">
              Chosen Affirmation
            </CardTitle>
            <Star className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="font-headline text-2xl font-bold text-foreground">
              &ldquo;{selectedQuote.text}&rdquo;
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-0 aspect-video flex items-center justify-center relative group bg-muted/20">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {visionBoardImage ? (
                <>
                  <Image src={visionBoardImage} alt="Vision Board" layout="fill" objectFit="cover" className="rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-lg">
                      <Button onClick={triggerImageUpload} variant="outline" size="icon">
                        <Upload className="h-5 w-5"/>
                      </Button>
                      <Button onClick={removeImage} variant="destructive" size="icon">
                        <Trash className="h-5 w-5"/>
                      </Button>
                  </div>
                </>
              ) : (
                <div 
                  className="text-center cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
                  onClick={triggerImageUpload}
                  data-ai-hint="vision board"
                >
                  <Upload className="h-8 w-8"/>
                  <p className="font-bold">Vision Board</p>
                  <p className="text-sm">Click to upload an image</p>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body text-primary">
                Daily Gratitude
              </CardTitle>
              <HeartHandshake className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Today I am grateful for..."
                className="bg-transparent border-none focus-visible:ring-0 text-base resize-none"
                rows={5}
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
              />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg text-primary">Personal Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                  placeholder="Your mission statement..."
                  value={missionStatement}
                  onChange={(e) => setMissionStatement(e.target.value)}
                  className="bg-transparent border-l-4 border-primary pl-4 italic text-foreground/80 focus-visible:ring-0 resize-none text-base"
                  rows={3}
                />
            </CardContent>
          </Card>
      </div>


      <div>
        <h2 className="font-headline text-2xl font-bold text-primary mb-4">Daily Reminders</h2>
        <div className="mb-4">
            <Card>
                <CardContent className="p-4 flex gap-2">
                    <Input 
                        placeholder="Add a new daily reminder..." 
                        value={newReminder}
                        onChange={(e) => setNewReminder(e.target.value)}
                        className="italic"
                    />
                    <Button onClick={addReminder}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="border-accent/30 bg-accent/10 flex flex-col items-center justify-center p-4 text-center group relative">
                  <reminder.icon className={`h-8 w-8 mb-2 ${reminder.color}`} />
                  <Input
                    value={reminder.text}
                    onChange={(e) => handleReminderChange(reminder.id, e.target.value)}
                    className="font-body font-semibold text-foreground text-center bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteReminder(reminder.id)}
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

    