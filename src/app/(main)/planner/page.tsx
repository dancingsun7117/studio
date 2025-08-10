"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const mafiaQuotes = [
  "Leave the gun. Take the cannoli. And the A+.",
  "Strategy is a weapon. Deploy it.",
  "She moved in silence, and her success made the noise.",
  "Never hate your enemies. It affects your judgment.",
  "An empire is built brick by brick, grade by grade."
];

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [monthlyQuote, setMonthlyQuote] = useState(mafiaQuotes[0]);

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    if (newDate.getFullYear() < 2030) {
      setCurrentDate(newDate);
      setMonthlyQuote(mafiaQuotes[newDate.getMonth() % mafiaQuotes.length]);
    }
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    if (newDate.getFullYear() >= 2025) {
      setCurrentDate(newDate);
      setMonthlyQuote(mafiaQuotes[newDate.getMonth() % mafiaQuotes.length]);
    }
  };
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Academic Planner
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Plan your 4-year journey to domination.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-headline text-2xl font-semibold text-center w-48">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-0">
             <Calendar
                mode="single"
                selected={new Date()}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="w-full"
                classNames={{
                    caption_label: "font-headline text-xl",
                    head_cell: "font-body",
                    cell: "font-body",
                }}
                footer={<p className="text-center text-sm p-2 text-muted-foreground">Weekly Planner: Monday Start | Deadlines | Coding Time Blocks</p>}
             />
          </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle className="font-headline text-accent">Monthly Focus</CardTitle></CardHeader>
                <CardContent><Textarea placeholder="e.g., Master dynamic programming..." /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="font-headline text-accent">Budget</CardTitle></CardHeader>
                <CardContent><Input type="number" placeholder="e.g., $500" /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="font-headline text-accent">Study Plan</CardTitle></CardHeader>
                <CardContent><Textarea placeholder="e.g., Mon: Algo, Tue: System Design..." /></CardContent>
            </Card>
             <Card className="border-primary/50 bg-primary/10">
                <CardHeader><CardTitle className="font-headline text-primary">Mafia-Mode Quote</CardTitle></CardHeader>
                <CardContent><p className="italic">"{monthlyQuote}"</p></CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
