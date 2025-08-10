"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const majorQuotes = [
  {
    quote: "Her grades were sharp, but her silence was sharper.",
    author: "The Strategist's Vow"
  },
  {
    quote: "She didn’t chase the top — she built it.",
    author: "The Architect's Creed"
  },
  {
    quote: "They call her a girl boss. She just calls it strategy.",
    author: "The Don's Doctrine"
  }
];

const initialAffirmations = [
  "Built for bugs & brilliance",
  "Mafia mind. Tech heart.",
  "Code like a queen, debug like a don.",
  "Every line of code is a step away from average.",
  "Git commit. Girl boss. Repeat.",
  "Silence the noise, amplify the code.",
  "My hustle is coded in ambition.",
  "The family business is empire building.",
  "Don't just break the glass ceiling, build a new one.",
  "A well-written function is my kind of poetry.",
  "Leave the drama, take the lead.",
  "My ambition wears a crown of code.",
  "In a world of followers, be the architect.",
  "Mastering the mainframe, and the main game.",
  "My legacy will be written in servers.",
  "The algorithm of my success is relentless.",
  "They whisper warnings, I hear applause.",
  "Build your own table, then own the room.",
  "Too glam to give a damn about your legacy code.",
  "A queen doesn't compete, she dominates.",
  "My command line is my kingdom.",
  "The best revenge is a flawless deployment.",
  "I don't need a knight, I need a faster compiler.",
  "Think like a boss, code like a beast.",
  "My power is not given, it is compiled.",
  "She trades in secrets and syntax.",
  "Stack traces and stilettos.",
  "Aptitude and attitude in equal measure.",
  "Running the world from my terminal.",
  "From commented code to a life uncommented.",
  "The only bugs I tolerate are in my rearview mirror.",
  "Elegance in code, and in conquest.",
  "My work speaks for itself, in multiple languages.",
  "Fear is just a variable I don't initialize.",
  "The code is law. I am the lawmaker.",
  "I am the architect of my own legacy.",
  "My potential is limitless, my ambition is not.",
  "I don't just solve problems, I command solutions.",
  "My network is my net worth, and my skills are my assets.",
  "The price of success is discipline. I pay it daily.",
  "I turn caffeine into code and ideas into empires.",
  "The glass ceiling is just a floor I haven't shattered yet.",
  "Success is my native language.",
  "I am not lucky. I am just that good.",
  "The world is my terminal. I have root access.",
  "I don't follow trends, I set them.",
  "My goals are not dreams, they are schematics.",
  "I am the queen of my own digital kingdom.",
  "My code is clean, but my ambition is ruthless.",
  "I don't just write code, I write history.",
  "The future is not something I wait for, it's something I build.",
  "I am not intimidating, you're just intimidated.",
  "My focus is a laser, my will is a fortress.",
  "I don't have a backup plan. I make the primary plan work.",
  "My intelligence is my greatest weapon.",
  "I don't just meet expectations, I redefine them.",
  "I am the storm they never saw coming.",
  "My success is not a bug, it's a feature.",
  "I don't play the game. I am the game.",
  "My value is not up for negotiation.",
  "I am the CEO of my own destiny.",
  "I don't just break barriers, I build new horizons.",
  "The only person I'm competing with is the woman I was yesterday.",
  "I am not just a woman in tech. I am the future of tech.",
];

export default function MotivationPage() {
  const [affirmations, setAffirmations] = useState(initialAffirmations);
  const [newAffirmation, setNewAffirmation] = useState('');

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      setAffirmations([newAffirmation, ...affirmations]);
      setNewAffirmation('');
    }
  };

  const handleAffirmationChange = (index: number, value: string) => {
    const updatedAffirmations = [...affirmations];
    updatedAffirmations[index] = value;
    setAffirmations(updatedAffirmations);
  };

  const deleteAffirmation = (index: number) => {
    const updatedAffirmations = affirmations.filter((_, i) => i !== index);
    setAffirmations(updatedAffirmations);
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary">
          The Codex of Power
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Words to fuel the empire you're building.
        </p>
      </div>
      
      <div className="grid gap-8">
        {majorQuotes.map((q, index) => (
          <Card key={index} className="border-accent/30 text-center">
            <CardContent className="p-8">
              <p className="font-headline text-3xl md:text-4xl text-foreground">
                &ldquo;{q.quote}&rdquo;
              </p>
              <p className="mt-4 font-body text-sm text-accent uppercase tracking-widest">
                - {q.author}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 flex gap-2">
            <Input 
              placeholder="Add a new affirmation..." 
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              className="italic"
            />
            <Button onClick={addAffirmation}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </CardContent>
        </Card>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {affirmations.map((affirmation, index) => (
              <div key={index} className="group break-inside-avoid p-4 rounded-lg bg-secondary relative">
                  <Input
                      value={affirmation}
                      onChange={(e) => handleAffirmationChange(index, e.target.value)}
                      className="bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary font-headline text-lg italic text-center w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteAffirmation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
