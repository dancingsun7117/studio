
"use client";

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import { addDays, addMonths, subMonths, format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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

const SCHEDULE_STORAGE_KEY = 'planner_schedule_v2';
const MONTHLY_FOCUS_STORAGE_KEY = 'planner_monthly_focus_v1';
const MONTHLY_BUDGET_STORAGE_KEY = 'planner_monthly_budget_v1';

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 1));
  const [monthlyQuote, setMonthlyQuote] = useState(mafiaQuotes[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [schedule, setSchedule] = useState<Record<string, DayData>>({});
  const [monthlyFocus, setMonthlyFocus] = useState<Record<string, string>>({});
  const [monthlyBudget, setMonthlyBudget] = useState<Record<string, string>>({});

  const [newEvent, setNewEvent] = useState({ title: '', time: '' });
  const [newTodo, setNewTodo] = useState('');

  // Load schedule from localStorage
  useEffect(() => {
    try {
      const savedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      } else {
         setSchedule({
            '2025-01-15': {
                events: [{title: 'Project Alpha Deadline', time: '23:59'}],
                todos: [{text: 'Submit final report', done: true}]
            }
        });
      }
    } catch (error) {
      console.error("Failed to parse schedule from localStorage", error);
    }
  }, []);

  // Save schedule to localStorage
  useEffect(() => {
    try {
        if (Object.keys(schedule).length > 0) {
            localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
        }
    } catch (error) {
        console.error("Failed to save schedule to localStorage", error);
    }
  }, [schedule]);
  
  // Load monthly focus from localStorage
  useEffect(() => {
    try {
      const savedFocus = localStorage.getItem(MONTHLY_FOCUS_STORAGE_KEY);
      if (savedFocus) {
        setMonthlyFocus(JSON.parse(savedFocus));
      }
    } catch (error) {
        console.error("Failed to load monthly focus from localStorage", error);
    }
  }, []);

  // Save monthly focus to localStorage
  useEffect(() => {
    try {
        localStorage.setItem(MONTHLY_FOCUS_STORAGE_KEY, JSON.stringify(monthlyFocus));
    } catch (error) {
        console.error("Failed to save monthly focus to localStorage", error);
    }
  }, [monthlyFocus]);
  
   // Load monthly budget from localStorage
  useEffect(() => {
    try {
      const savedBudget = localStorage.getItem(MONTHLY_BUDGET_STORAGE_KEY);
      if (savedBudget) {
        setMonthlyBudget(JSON.parse(savedBudget));
      }
    } catch (error) {
        console.error("Failed to load monthly budget from localStorage", error);
    }
  }, []);

  // Save monthly budget to localStorage
  useEffect(() => {
    try {
        localStorage.setItem(MONTHLY_BUDGET_STORAGE_KEY, JSON.stringify(monthlyBudget));
    } catch (error) {
        console.error("Failed to save monthly budget to localStorage", error);
    }
  }, [monthlyBudget]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setMonthlyQuote(mafiaQuotes[newDate.getMonth() % mafiaQuotes.length]);
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setMonthlyQuote(mafiaQuotes[newDate.getMonth() % mafiaQuotes.length]);
  };

  const getDayKey = (date: Date) => format(date, 'yyyy-MM-dd');
  const getMonthKey = (date: Date) => format(date, 'yyyy-MM');

  const handleMonthlyFocusChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const monthKey = getMonthKey(currentDate);
    setMonthlyFocus(prev => ({ ...prev, [monthKey]: e.target.value }));
  };
  
  const handleMonthlyBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const monthKey = getMonthKey(currentDate);
    setMonthlyBudget(prev => ({ ...prev, [monthKey]: e.target.value }));
  };

  const updateScheduleForDay = (dayKey: string, newDayData: DayData) => {
    setSchedule(prev => {
        const newSchedule = {...prev};
        if (newDayData.events.length === 0 && newDayData.todos.length === 0) {
            delete newSchedule[dayKey];
        } else {
            newSchedule[dayKey] = newDayData;
        }
        return newSchedule;
    });
  };
  
  const addEventToDate = (date: Date) => {
    if (!newEvent.title.trim()) return;
    const dayKey = getDayKey(date);
    const dayData = schedule[dayKey] || { events: [], todos: [] };
    const updatedDayData = {
      ...dayData,
      events: [...dayData.events, newEvent],
    };
    updateScheduleForDay(dayKey, updatedDayData);
    setNewEvent({ title: '', time: '' });
  };

  const addEventToSchedule = () => {
    if (!selectedDate) return;
    addEventToDate(selectedDate);
  };
  
  const addEventForNextDay = () => {
    if (!selectedDate) return;
    const nextDay = addDays(selectedDate, 1);
    addEventToDate(nextDay);
  };
  
  const addTodoToSchedule = () => {
    if (!selectedDate || !newTodo.trim()) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey] || { events: [], todos: [] };
    const updatedDayData = {
      ...dayData,
      todos: [...dayData.todos, { text: newTodo, done: false }],
    };
    updateScheduleForDay(dayKey, updatedDayData);
    setNewTodo('');
  };

  const toggleTodo = (todoIndex: number) => {
    if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;
    
    const updatedTodos = [...dayData.todos];
    updatedTodos[todoIndex].done = !updatedTodos[todoIndex].done;
    updateScheduleForDay(dayKey, { ...dayData, todos: updatedTodos });
  };

  const deleteEvent = (eventIndex: number) => {
     if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;

    const updatedEvents = dayData.events.filter((_, i) => i !== eventIndex);
    updateScheduleForDay(dayKey, { ...dayData, events: updatedEvents });
  };

  const deleteTodo = (todoIndex: number) => {
     if (!selectedDate) return;
    const dayKey = getDayKey(selectedDate);
    const dayData = schedule[dayKey];
    if(!dayData) return;
    
    const updatedTodos = dayData.todos.filter((_, i) => i !== todoIndex);
    updateScheduleForDay(dayKey, { ...dayData, todos: updatedTodos });
  };

  const selectedDayKey = selectedDate ? getDayKey(selectedDate) : '';
  const selectedDayData = schedule[selectedDayKey] || { events: [], todos: [] };
  const currentMonthKey = getMonthKey(currentDate);
  
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
            <Button variant="outline" size="icon" onClick={handlePrevMonth} disabled={currentDate.getFullYear() <= 2025 && currentDate.getMonth() === 0}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-headline text-2xl font-semibold text-center w-48">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={currentDate.getFullYear() >= 2029 && currentDate.getMonth() === 11}>
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
                disabled={{ before: new Date(2025, 0, 1), after: new Date(2029, 11, 31) }}
                footer={<p className="text-center text-sm p-2 text-muted-foreground">Weekly Planner: Monday Start | Deadlines | Coding Time Blocks</p>}
             />
          </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle className="font-headline text-accent">Monthly Focus</CardTitle></CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="e.g., Master dynamic programming..." 
                        value={monthlyFocus[currentMonthKey] || ''}
                        onChange={handleMonthlyFocusChange}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle className="font-headline text-accent">Budget</CardTitle></CardHeader>
                <CardContent>
                    <Input 
                        type="text"
                        placeholder="e.g., ₹40000" 
                        value={monthlyBudget[currentMonthKey] || ''}
                        onChange={handleMonthlyBudgetChange}
                    />
                </CardContent>
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
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div>
                        <h3 className="font-bold text-accent mb-2">Events</h3>
                        <div className="space-y-2">
                            {selectedDayData.events.length > 0 ? (
                                selectedDayData.events.map((event, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-secondary/10">
                                        <span className="font-semibold">{event.time}</span>
                                        <span className="flex-1">{event.title}</span>
                                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(index)} className="h-6 w-6"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))
                            ) : (<p className="text-sm text-muted-foreground italic">No events scheduled.</p>)}
                        </div>
                         <div className="mt-4 flex gap-2">
                            <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" />
                            <Input value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} placeholder="Time" className="w-28" />
                            <Button onClick={addEventToSchedule} size="icon" title="Add to selected date"><PlusCircle className="h-4 w-4"/></Button>
                        </div>
                        <div className="mt-2">
                            <Button onClick={addEventForNextDay} variant="outline" size="sm" className="w-full">
                                Add for Next Day ({selectedDate ? format(addDays(selectedDate, 1), 'LLL d') : ''})
                            </Button>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-accent mb-2 mt-4">To-Do List</h3>
                        <div className="space-y-2">
                            {selectedDayData.todos.length > 0 ? (
                                selectedDayData.todos.map((todo, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Checkbox id={`todo-${index}`} checked={todo.done} onCheckedChange={() => toggleTodo(index)}/>
                                        <label htmlFor={`todo-${index}`} className={`flex-1 ${todo.done ? 'line-through text-muted-foreground' : ''}`}>{todo.text}</label>
                                        <Button variant="ghost" size="icon" onClick={() => deleteTodo(index)} className="h-6 w-6"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))
                            ) : (<p className="text-sm text-muted-foreground italic">No tasks for today.</p>)}
                        </div>
                         <div className="mt-4 flex gap-2">
                             <Input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="New to-do item..." />
                            <Button onClick={addTodoToSchedule} size="icon"><PlusCircle className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </div>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mt-4 w-full">
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    