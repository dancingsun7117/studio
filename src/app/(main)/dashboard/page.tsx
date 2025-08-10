"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, GitCommit, BrainCircuit, Star, GlassWater, Apple, Dumbbell, BookOpen, Sparkles, Smile, Heart, PlusCircle, Trash2 } from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const quotes = [
  {
    icon: Crown,
    text: "Code like a queen, debug like a don.",
  },
  {
    icon: GitCommit,
    text: "Git commit. Girl boss. Repeat.",
  },
  {
    icon: BrainCircuit,
    text: "Every line of code is a step away from average.",
  },
];

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

export default function DashboardPage() {
  const { selectedQuote } = useQuote();
  const [reminders, setReminders] = useState(initialReminders);
  const [newReminder, setNewReminder] = useState('');

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
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome, Neeshna
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This is your command center. Track your progress, plan your conquests, and build your empire, one line of code at a time.
        </p>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote, index) => (
          <Card key={index} className="border-accent/30 bg-accent/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">
                Daily Affirmation
              </CardTitle>
              <quote.icon className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold font-headline text-foreground">
                {quote.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Personal Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80">
            “In a world full of noise, she codes in silence and conquers in power.”
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
