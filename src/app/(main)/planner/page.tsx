"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const mafiaQuotes = [
  "Leave the gun. Take the cannoli. And the A+.",
  "Strategy is a weapon. Deploy it.",
  "She moved in silence, and her success made the noise.",
  "Never hate your enemies. It affects your judgment.",
  "An empire is built brick by brick, grade by grade."
];

interface Event {
  title: string;
  time: string;
}

interface Todo {
  text: string;
  done: boolean;
}

interface DayData {
  events: Event[];
  todos: Todo[];
}

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [monthlyQuote, setMonthlyQuote] = useState(mafiaQuotes[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [schedule, setSchedule] = useState<Record<string, DayData>>({
    '2025-01-15': {
        events: [{title: 'Project Alpha Deadline', time: '23:59'}],
        todos: [{text: 'Submit final report', done: true}]
    }
  });

  const [newEvent, setNewEvent] = useState({ title: '', time: '' });
  const [newTodo, setNewTodo] = useState('');

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

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

  const getDayKey = (date: Date) => format(date, 'yyyy-MM-dd');

  const addEventToSchedule = () => {
    if (!selectedDate || !newEvent.title) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey] || { events: [], todos: [] };
    const updatedDayData = {
      ...dayData,
      events: [...dayData.events, newEvent],
    };
    setSchedule({ ...schedule, [dayKey]: updatedDayData });
    setNewEvent({ title: '', time: '' });
  };
  
  const addTodoToSchedule = () => {
    if (!selectedDate || !newTodo) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey] || { events: [], todos: [] };
    const updatedDayData = {
      ...dayData,
      todos: [...dayData.todos, { text: newTodo, done: false }],
    };
    setSchedule({ ...schedule, [dayKey]: updatedDayData });
    setNewTodo('');
  };

  const toggleTodo = (todoIndex: number) => {
    if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;
    const updatedTodos = [...dayData.todos];
    updatedTodos[todoIndex].done = !updatedTodos[todoIndex].done;
    setSchedule({ ...schedule, [dayKey]: { ...dayData, todos: updatedTodos } });
  }

  const deleteEvent = (eventIndex: number) => {
     if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;
    const updatedEvents = dayData.events.filter((_, i) => i !== eventIndex);
    setSchedule({ ...schedule, [dayKey]: { ...dayData, events: updatedEvents } });
  }

  const deleteTodo = (todoIndex: number) => {
     if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;
    const updatedTodos = dayData.todos.filter((_, i) => i !== todoIndex);
    setSchedule({ ...schedule, [dayKey]: { ...dayData, todos: updatedTodos } });
  }
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Academic Planner
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Plan your 4-year journey to domination. Click on a date to add events and tasks.
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
                selected={selectedDate}
                onSelect={handleDateSelect}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-primary">
                        {selectedDate ? format(selectedDate, 'PPP') : 'Schedule'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-accent mb-2">Events</h3>
                        <ul className="space-y-2">
                            {selectedDate && schedule[getDayKey(selectedDate)]?.events.map((event, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="flex-1">{event.time} - {event.title}</span>
                                    <Button variant="ghost" size="icon" onClick={() => deleteEvent(index)}><Trash2 className="h-4 w-4" /></Button>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-2 flex gap-2">
                            <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" />
                            <Input value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} placeholder="Time" className="w-24" />
                            <Button onClick={addEventToSchedule} size="icon"><PlusCircle className="h-4 w-4"/></Button>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-accent mb-2">To-Do List</h3>
                        <ul className="space-y-2">
                            {selectedDate && schedule[getDayKey(selectedDate)]?.todos.map((todo, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Checkbox checked={todo.done} onCheckedChange={() => toggleTodo(index)}/>
                                    <span className={`flex-1 ${todo.done ? 'line-through text-muted-foreground' : ''}`}>{todo.text}</span>
                                    <Button variant="ghost" size="icon" onClick={() => deleteTodo(index)}><Trash2 className="h-4 w-4" /></Button>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-2 flex gap-2">
                             <Input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="New to-do..." />
                            <Button onClick={addTodoToSchedule} size="icon"><PlusCircle className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </div>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mt-4">
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </div>
  );
}
