
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, GitBranch, GraduationCap, Trophy, Users, Briefcase, Target, PlusCircle, Trash2, HeartPulse, GlassWater, Dumbbell, Bed } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const trackerSections = [
    { value: 'habits', label: 'Habit Tracker', icon: CheckCircle },
    { value: 'goals', label: 'Goal Tracker', icon: Target },
    { value: 'health', label: 'Health & Fitness', icon: HeartPulse },
    { value: 'cgpa', label: 'CGPA Tracker', icon: GraduationCap },
    { value: 'coding', label: 'Coding Skills', icon: GitBranch },
    { value: 'finance', label: 'Finance Tracker', icon: DollarSign },
    { value: 'experience', label: 'Experience', icon: Briefcase },
    { value: 'events', label: 'Events & Orgs', icon: Trophy },
    { value: 'placement', label: 'Placement Prep', icon: Users },
];

const initialHabits = [
  { name: 'Code for 2 hours', days: Array(7).fill(false) },
  { name: 'Review DSA Concepts', days: Array(7).fill(false) },
  { name: 'Workout', days: Array(7).fill(false) },
  { name: 'Read a Tech Article', days: Array(7).fill(false) },
  { name: 'Connect with 1 person on LinkedIn', days: Array(7).fill(false) },
];

const initialSemesters = [...Array(8)].map(() => ({ sgpa: '', credits: '' }));

const initialTransactions = [
    { description: 'Scholarship', amount: 1000, type: 'income' as const },
    { description: 'Freelance Project', amount: 200, type: 'income' as const },
    { description: 'Textbooks', amount: -150, type: 'expense' as const },
    { description: 'Coffee', amount: -50, type: 'expense' as const },
];

const initialSkills = [
    { name: 'Data Structures', value: 75 },
    { name: 'Algorithms', value: 60 },
    { name: 'System Design', value: 40 },
    { name: 'LeetCode (Easy)', value: 90 },
    { name: 'LeetCode (Medium)', value: 65 },
    { name: 'LeetCode (Hard)', value: 30 },
];

const initialExperience = [
    { type: 'Internship', title: 'SDE Intern @ Google', duration: 'May 2026 - Aug 2026', status: 'Completed' },
    { type: 'Project', title: 'AI-Powered Planner', duration: 'Jan 2025 - Mar 2025', status: 'In Progress' },
    { type: 'Research', title: 'Quantum Computing Applications', duration: 'Ongoing', status: 'Ongoing' }
];

const initialInvolvement = [
    { activity: 'Hacktoberfest', contribution: 'Contributor (5 PRs)', date: 'Oct 2025' },
    { activity: 'Women in Tech Club', contribution: 'President', date: '2026-2027' }
];

const initialGoals = [
    { category: 'Academic', text: 'Maintain 9+ CGPA', done: true },
    { category: 'Personal', text: 'Read 12 books this year', done: false },
    { category: 'Financial', text: 'Save $5000 for post-grad trip', done: false }
]

const initialPlacementPrep = [
    { text: 'Resume Updated & Tailored', done: true },
    { text: 'Aptitude Practice (5/10 tests)', done: false },
    { text: 'Technical Mock Interviews (2/5)', done: false },
    { text: 'HR Mock Interviews (1/2)', done: false },
];

const initialHealthData = {
    water: 4, // in glasses
    workouts: [
        { activity: 'HIIT', duration: '30 min', date: '2025-07-21' }
    ],
    sleep: 7.5, // in hours
    hygiene: [
        { text: 'Skincare Routine', done: true },
        { text: 'Floss', done: true },
        { text: 'Tidy up room', done: false }
    ]
};

const TRACKERS_STORAGE_KEY_PREFIX = 'trackers_v1_';

export function TrackersView() {
    const [habits, setHabits] = useState(initialHabits);
    const [newHabit, setNewHabit] = useState('');
    
    const [goals, setGoals] = useState(initialGoals);
    const [newGoal, setNewGoal] = useState({text: '', category: 'Academic'});
    
    const [healthData, setHealthData] = useState(initialHealthData);
    const [newWorkout, setNewWorkout] = useState({ activity: '', duration: '', date: ''});
    const [newHygieneItem, setNewHygieneItem] = useState('');

    const [semesters, setSemesters] = useState(initialSemesters);
    const [cgpa, setCgpa] = useState({current: '8.5', goal: '9.0'});
    
    const [skills, setSkills] = useState(initialSkills);
    const [newSkill, setNewSkill] = useState({name: '', value: 50});
    
    const [transactions, setTransactions] = useState(initialTransactions);
    const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense' as const });
    
    const [experience, setExperience] = useState(initialExperience);
    
    const [involvement, setInvolvement] = useState(initialInvolvement);
    
    const [placementPrep, setPlacementPrep] = useState(initialPlacementPrep);
    const [newPrepItem, setNewPrepItem] = useState('');

    const stateMap: Record<string, [any, React.Dispatch<any>]> = {
        habits: [habits, setHabits],
        goals: [goals, setGoals],
        health: [healthData, setHealthData],
        cgpaState: [{semesters, cgpa}, (val: any) => { setSemesters(val.semesters); setCgpa(val.cgpa); }],
        skills: [skills, setSkills],
        finance: [transactions, setTransactions],
        experience: [experience, setExperience],
        events: [involvement, setInvolvement],
        placement: [placementPrep, setPlacementPrep]
    };

    useEffect(() => {
        Object.keys(stateMap).forEach(key => {
            try {
                const savedState = localStorage.getItem(`${TRACKERS_STORAGE_KEY_PREFIX}${key}`);
                if (savedState) {
                    stateMap[key][1](JSON.parse(savedState));
                }
            } catch (error) {
                console.error(`Failed to parse ${key} from localStorage`, error);
            }
        });
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}goals`, JSON.stringify(goals));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}health`, JSON.stringify(healthData));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}cgpaState`, JSON.stringify({semesters, cgpa}));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}skills`, JSON.stringify(skills));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}finance`, JSON.stringify(transactions));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}experience`, JSON.stringify(experience));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}events`, JSON.stringify(involvement));
            localStorage.setItem(`${TRACKERS_STORAGE_KEY_PREFIX}placement`, JSON.stringify(placementPrep));
        } catch (error) {
            console.error("Failed to save trackers to localStorage", error);
        }
    }, [habits, goals, healthData, semesters, cgpa, skills, transactions, experience, involvement, placementPrep]);

    const toggleHabit = (habitIndex: number, dayIndex: number) => {
        const newHabits = [...habits];
        newHabits[habitIndex].days[dayIndex] = !newHabits[habitIndex].days[dayIndex];
        setHabits(newHabits);
    };

    const handleHabitNameChange = (habitIndex: number, newName: string) => {
        const newHabits = [...habits];
        newHabits[habitIndex].name = newName;
        setHabits(newHabits);
    }

    const addHabit = () => {
        if(newHabit.trim()){
            setHabits([...habits, { name: newHabit, days: Array(7).fill(false) }]);
            setNewHabit('');
        }
    }

    const deleteHabit = (habitIndex: number) => {
        setHabits(habits.filter((_, index) => index !== habitIndex));
    }

    // State for CGPA Tracker
    const handleSemesterChange = (index: number, field: 'sgpa' | 'credits', value: string) => {
        const newSemesters = [...semesters];
        newSemesters[index][field] = value;
        setSemesters(newSemesters);
    }
    
    // State for Finance Tracker
    const addTransaction = () => {
        const amount = parseFloat(newTransaction.amount);
        if(newTransaction.description.trim() && !isNaN(amount)){
            const finalAmount = newTransaction.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
            setTransactions([{description: newTransaction.description, amount: finalAmount, type: newTransaction.type}, ...transactions]);
            setNewTransaction({ description: '', amount: '', type: 'expense' });
        }
    }

    const deleteTransaction = (index: number) => {
        setTransactions(transactions.filter((_, i) => i !== index));
    }
    
    const handleTransactionChange = (field: keyof typeof newTransaction, value: string | 'income' | 'expense') => {
        setNewTransaction(prev => ({...prev, [field]: value}));
    }

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);


    // State for Coding Skills
    const handleSkillChange = (index: number, value: number[]) => {
        const newSkills = [...skills];
        newSkills[index].value = isNaN(value[0]) ? 0 : Math.min(100, Math.max(0, value[0]));
        setSkills(newSkills);
    };

     const handleSkillNameChange = (index: number, name: string) => {
        const newSkills = [...skills];
        newSkills[index].name = name;
        setSkills(newSkills);
    };

    const handleNewSkillChange = (field: keyof typeof newSkill, value: string | number) => {
        setNewSkill(prev => ({...prev, [field]: value}));
    }

    const addSkill = () => {
        if(newSkill.name.trim()){
            setSkills([...skills, { name: newSkill.name, value: Number(newSkill.value) }]);
            setNewSkill({name: '', value: 50});
        }
    }

    const deleteSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    }


    // State for Experience Tracker
    const addExperience = () => setExperience([...experience, { type: 'Project', title: '', duration: '', status: 'In Progress' }]);
    const deleteExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));
    const handleExperienceChange = (index: number, field: keyof typeof experience[0], value: string) => {
        const newExperience = [...experience];
        (newExperience[index] as any)[field] = value;
        setExperience(newExperience);
    }


    // State for Involvement Tracker
    const addInvolvement = () => setInvolvement([...involvement, { activity: '', contribution: '', date: '' }]);
    const deleteInvolvement = (index: number) => setInvolvement(involvement.filter((_, i) => i !== index));
    const handleInvolvementChange = (index: number, field: keyof typeof involvement[0], value: string) => {
        const newInvolvement = [...involvement];
        (newInvolvement[index] as any)[field] = value;
        setInvolvement(newInvolvement);
    }

    // State for Placement Prep
    const togglePlacementPrep = (index: number) => {
        const newPlacementPrep = [...placementPrep];
        newPlacementPrep[index].done = !newPlacementPrep[index].done;
        setPlacementPrep(newPlacementPrep);
    }

    const addPlacementPrepItem = () => {
        if (newPrepItem.trim()) {
            setPlacementPrep([...placementPrep, { text: newPrepItem, done: false }]);
            setNewPrepItem('');
        }
    };
    
    const deletePlacementPrepItem = (index: number) => {
        setPlacementPrep(placementPrep.filter((_, i) => i !== index));
    };

     const handlePlacementPrepChange = (index: number, text: string) => {
        const newPlacementPrep = [...placementPrep];
        newPlacementPrep[index].text = text;
        setPlacementPrep(newPlacementPrep);
    }

    // State for Goal Tracker
    const toggleGoal = (index: number) => {
        const newGoals = [...goals];
        newGoals[index].done = !newGoals[index].done;
        setGoals(newGoals);
    };

    const addGoal = (category: string) => {
        if(newGoal.text.trim() && newGoal.category === category) {
            setGoals([...goals, { text: newGoal.text, category: newGoal.category, done: false}]);
            setNewGoal({text: '', category: 'Academic'});
        }
    };

    const deleteGoal = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    const handleGoalTextChange = (index: number, text: string) => {
        const newGoals = [...goals];
        newGoals[index].text = text;
        setGoals(newGoals);
    };

    // State for Health Tracker
    const handleWaterChange = (value: number[]) => setHealthData({...healthData, water: value[0]});
    const handleSleepChange = (value: number[]) => setHealthData({...healthData, sleep: value[0]});
    
    const addWorkout = () => {
        if (newWorkout.activity.trim() && newWorkout.duration.trim() && newWorkout.date.trim()) {
            setHealthData({...healthData, workouts: [newWorkout, ...healthData.workouts]});
            setNewWorkout({ activity: '', duration: '', date: ''});
        }
    };
    const deleteWorkout = (index: number) => {
        const newWorkouts = healthData.workouts.filter((_, i) => i !== index);
        setHealthData({...healthData, workouts: newWorkouts});
    };

    const addHygieneItem = () => {
        if (newHygieneItem.trim()) {
            setHealthData({...healthData, hygiene: [...healthData.hygiene, {text: newHygieneItem, done: false}]});
            setNewHygieneItem('');
        }
    };
    const toggleHygiene = (index: number) => {
        const newHygiene = [...healthData.hygiene];
        newHygiene[index].done = !newHygiene[index].done;
        setHealthData({...healthData, hygiene: newHygiene});
    };
    const deleteHygiene = (index: number) => {
        const newHygiene = healthData.hygiene.filter((_, i) => i !== index);
        setHealthData({...healthData, hygiene: newHygiene});
    };
    const handleHygieneTextChange = (index: number, text: string) => {
        const newHygiene = [...healthData.hygiene];
        newHygiene[index].text = text;
        setHealthData({ ...healthData, hygiene: newHygiene });
    };

    return (
        <Tabs defaultValue="habits" className="w-full flex flex-col md:flex-row gap-6">
            <TabsList className="w-full md:w-48 flex-col h-auto justify-start">
                {trackerSections.map(section => (
                    <TabsTrigger key={section.value} value={section.value} className="w-full flex gap-2 justify-start p-4">
                        <section.icon className="h-5 w-5" /> <span className="hidden md:inline">{section.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
            <div className="flex-1">
                <TabsContent value="habits" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Weekly Habit Tracker</CardTitle>
                            <CardDescription>Consistency is the key to mastery. Check off your habits daily.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Card>
                                <CardContent className="p-4 flex gap-2">
                                    <Input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Add a new daily habit..." />
                                    <Button onClick={addHabit}><PlusCircle className="mr-2 h-4 w-4" />Add Habit</Button>
                                </CardContent>
                            </Card>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[40%] font-bold">Habit</TableHead>
                                            <TableHead className="text-center font-bold">M</TableHead>
                                            <TableHead className="text-center font-bold">T</TableHead>
                                            <TableHead className="text-center font-bold">W</TableHead>
                                            <TableHead className="text-center font-bold">T</TableHead>
                                            <TableHead className="text-center font-bold">F</TableHead>
                                            <TableHead className="text-center font-bold">S</TableHead>
                                            <TableHead className="text-center font-bold">S</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {habits.map((habit, habitIndex) => (
                                            <TableRow key={habitIndex}>
                                                <TableCell>
                                                    <Input 
                                                        value={habit.name} 
                                                        onChange={(e) => handleHabitNameChange(habitIndex, e.target.value)}
                                                        className="border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                                                    />
                                                </TableCell>
                                                {habit.days.map((day, dayIndex) => (
                                                    <TableCell key={dayIndex} className="text-center">
                                                        <Checkbox checked={day} onCheckedChange={() => toggleHabit(habitIndex, dayIndex)} />
                                                    </TableCell>
                                                ))}
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => deleteHabit(habitIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="goals" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Goal Tracker</CardTitle>
                            <CardDescription>Set and conquer your academic, personal, and financial goals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                {(['Academic', 'Personal', 'Financial'] as const).map(category => (
                                    <Card key={category} className="bg-background/50">
                                        <CardHeader>
                                        <CardTitle className="font-headline text-accent">{category} Goals</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input 
                                                    placeholder={`New ${category} goal...`}
                                                    value={newGoal.category === category ? newGoal.text : ''}
                                                    onChange={e => setNewGoal({text: e.target.value, category})}
                                                />
                                                <Button onClick={() => addGoal(category)} size="icon"><PlusCircle className="h-4 w-4"/></Button>
                                            </div>
                                            <div className="space-y-2">
                                                {goals.filter(g => g.category === category).map((goal, index) => {
                                                    const originalIndex = goals.findIndex(g => g.text === goal.text && g.category === goal.category);
                                                    return (
                                                        <div key={originalIndex} className="flex items-center gap-2 group">
                                                            <Checkbox id={`goal-${originalIndex}`} checked={goal.done} onCheckedChange={() => toggleGoal(originalIndex)}/>
                                                            <Input
                                                            value={goal.text}
                                                            onChange={(e) => handleGoalTextChange(originalIndex, e.target.value)}
                                                            className={`flex-1 h-auto p-0 border-none bg-transparent focus-visible:ring-0 ${goal.done ? 'line-through text-muted-foreground' : ''}`}
                                                            />
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => deleteGoal(originalIndex)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="health" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Health, Fitness & Hygiene</CardTitle>
                            <CardDescription>A healthy mind in a healthy body. Track your wellness metrics.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                                        <GlassWater className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-2xl font-bold">{healthData.water} glasses</div>
                                        <Slider value={[healthData.water]} onValueChange={handleWaterChange} max={16} step={1} className="w-3/4" />
                                    </CardContent>
                                </Card>
                                <Card>
                                     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Sleep</CardTitle>
                                        <Bed className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-2xl font-bold">{healthData.sleep.toFixed(1)} hours</div>
                                        <Slider value={[healthData.sleep]} onValueChange={handleSleepChange} max={12} step={0.5} className="w-3/4" />
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">Workouts</CardTitle>
                                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center space-y-1">
                                        <div className="text-2xl font-bold">{healthData.workouts.length}</div>
                                        <p className="text-xs text-muted-foreground">sessions this week</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-headline text-lg text-accent mb-2">Workout Log</h3>
                                    <Card>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex gap-2">
                                                <Input placeholder="Activity" value={newWorkout.activity} onChange={e => setNewWorkout({...newWorkout, activity: e.target.value})} />
                                                <Input placeholder="Duration" className="w-28" value={newWorkout.duration} onChange={e => setNewWorkout({...newWorkout, duration: e.target.value})} />
                                                <Input type="date" className="w-40" value={newWorkout.date} onChange={e => setNewWorkout({...newWorkout, date: e.target.value})} />
                                                <Button onClick={addWorkout} size="icon"><PlusCircle className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                                {healthData.workouts.map((w, i) => (
                                                    <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/10 text-sm">
                                                        <span className="font-semibold flex-1">{w.activity}</span>
                                                        <span>{w.duration}</span>
                                                        <span className="text-muted-foreground">{w.date}</span>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteWorkout(i)} className="h-6 w-6"><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <h3 className="font-headline text-lg text-accent mb-2">Hygiene & Self-Care</h3>
                                     <Card>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex gap-2">
                                                <Input placeholder="New task..." value={newHygieneItem} onChange={e => setNewHygieneItem(e.target.value)} />
                                                <Button onClick={addHygieneItem} size="icon"><PlusCircle className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                                {healthData.hygiene.map((h, i) => (
                                                    <div key={i} className="flex items-center gap-3 group">
                                                         <Checkbox id={`hygiene-${i}`} checked={h.done} onCheckedChange={() => toggleHygiene(i)}/>
                                                         <Input
                                                            value={h.text}
                                                            onChange={(e) => handleHygieneTextChange(i, e.target.value)}
                                                            className={`flex-1 p-0 h-auto border-none bg-transparent focus-visible:ring-0 ${h.done ? 'line-through text-muted-foreground' : ''}`}
                                                        />
                                                         <Button variant="ghost" size="icon" onClick={() => deleteHygiene(i)} className="h-6 w-6 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="cgpa" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">CGPA Tracker</CardTitle>
                            <CardDescription>A perfect score isn&apos;t the goal. Dominance is.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Card className="bg-background/50">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-sm font-medium text-muted-foreground">Current CGPA</label><Input type="number" placeholder="8.5" value={cgpa.current} onChange={e => setCgpa({...cgpa, current: e.target.value})} className="text-lg font-bold"/></div>
                                <div><label className="text-sm font-medium text-muted-foreground">Goal CGPA</label><Input type="number" placeholder="9.0+" value={cgpa.goal} onChange={e => setCgpa({...cgpa, goal: e.target.value})} className="text-lg font-bold"/></div>
                                </CardContent>
                            </Card>
                            <div className="rounded-md border">
                            <Table>
                                <TableHeader><TableRow><TableHead className="font-bold">Semester</TableHead><TableHead className="font-bold">SGPA</TableHead><TableHead className="font-bold">Credits</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {semesters.map((sem, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-semibold">Semester {i+1}</TableCell>
                                            <TableCell><Input type="number" placeholder="-" value={sem.sgpa} onChange={e => handleSemesterChange(i, 'sgpa', e.target.value)} className="w-24"/></TableCell>
                                            <TableCell><Input type="number" placeholder="-" value={sem.credits} onChange={e => handleSemesterChange(i, 'credits', e.target.value)} className="w-24" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="coding" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Coding Skill Tracker</CardTitle>
                            <CardDescription>Track your proficiency. Every line of code builds the empire.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Card>
                                <CardContent className="p-4 flex gap-2">
                                    <Input value={newSkill.name} onChange={e => handleNewSkillChange('name', e.target.value)} placeholder="Add a new skill to master..." />
                                    <Input type="number" value={newSkill.value} onChange={e => handleNewSkillChange('value', e.target.value)} placeholder="%" className="w-24" />
                                    <Button onClick={addSkill}><PlusCircle className="mr-2 h-4 w-4" />Add Skill</Button>
                                </CardContent>
                            </Card>
                            <div className="space-y-6 pt-4">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-4 group">
                                        <div className="w-40 pr-4">
                                            <Input
                                                value={skill.name}
                                                onChange={(e) => handleSkillNameChange(index, e.target.value)}
                                                className="text-base font-semibold text-foreground p-0 h-auto border-none bg-transparent focus-visible:ring-0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Slider
                                                value={[skill.value]}
                                                onValueChange={(value) => handleSkillChange(index, value)}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-primary w-12 text-right">{skill.value}%</span>
                                        <Button variant="ghost" size="icon" onClick={() => deleteSkill(index)} className="opacity-0 group-hover:opacity-100">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Finance Tracker</CardTitle>
                            <CardDescription>Money is power. Manage it like a don.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-background/50"><CardHeader><CardTitle className="text-green-500">${totalIncome.toFixed(2)}</CardTitle><CardDescription>Total Income</CardDescription></CardHeader></Card>
                            <Card className="bg-background/50"><CardHeader><CardTitle className="text-red-500">${Math.abs(totalExpenses).toFixed(2)}</CardTitle><CardDescription>Total Expenses</CardDescription></CardHeader></Card>
                            <Card className="bg-primary/10 border-primary/50"><CardHeader><CardTitle className="text-primary">${(totalIncome + totalExpenses).toFixed(2)}</CardTitle><CardDescription>Net Balance</CardDescription></CardHeader></Card>
                            </div>
                            <Card>
                                <CardContent className="p-4 flex gap-2">
                                    <Input value={newTransaction.description} onChange={e => handleTransactionChange('description', e.target.value)} placeholder="Description" />
                                    <Input type="number" value={newTransaction.amount} onChange={e => handleTransactionChange('amount', e.target.value)} placeholder="Amount" className="w-32" />
                                    <Select value={newTransaction.type} onValueChange={(value) => handleTransactionChange('type', value as 'income' | 'expense')}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={addTransaction}><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
                                </CardContent>
                            </Card>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="font-bold">Description</TableHead><TableHead className="font-bold text-right">Amount</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {transactions.map((t, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium">{t.description}</TableCell>
                                                <TableCell className={`text-right font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>${t.amount.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => deleteTransaction(i)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Experience Tracker</CardTitle>
                            <CardDescription>Log internships, projects, and research. Every victory counts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="font-bold w-32">Type</TableHead><TableHead className="font-bold">Title/Organization</TableHead><TableHead className="font-bold w-48">Duration</TableHead><TableHead className="font-bold w-40">Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {experience.map((exp, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Select value={exp.type} onValueChange={(value) => handleExperienceChange(index, 'type', value)}>
                                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Internship">Internship</SelectItem>
                                                            <SelectItem value="Project">Project</SelectItem>
                                                            <SelectItem value="Research">Research</SelectItem>
                                                            <SelectItem value="Volunteer">Volunteer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell><Input value={exp.title} onChange={e => handleExperienceChange(index, 'title', e.target.value)} /></TableCell>
                                                <TableCell><Input value={exp.duration} onChange={e => handleExperienceChange(index, 'duration', e.target.value)} /></TableCell>
                                                <TableCell>
                                                    <Select value={exp.status} onValueChange={(value) => handleExperienceChange(index, 'status', value)}>
                                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Completed">Completed</SelectItem>
                                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                                            <SelectItem value="Planned">Planned</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteExperience(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <Button className="mt-4" onClick={addExperience}><PlusCircle className="mr-2 h-4 w-4"/> Add Experience</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Involvement Tracker</CardTitle>
                            <CardDescription>Track events, hackathons, and clubs. Build your network.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="font-bold">Activity/Club</TableHead><TableHead className="font-bold">Role/Contribution</TableHead><TableHead className="font-bold w-40">Date</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {involvement.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Input value={item.activity} onChange={e => handleInvolvementChange(index, 'activity', e.target.value)} className="font-semibold"/></TableCell>
                                                <TableCell><Input value={item.contribution} onChange={e => handleInvolvementChange(index, 'contribution', e.target.value)} /></TableCell>
                                                <TableCell><Input value={item.date} onChange={e => handleInvolvementChange(index, 'date', e.target.value)} /></TableCell>
                                                <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteInvolvement(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <Button className="mt-4" onClick={addInvolvement}><PlusCircle className="mr-2 h-4 w-4"/> Add Involvement</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="placement" className="mt-0">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-primary">Placement Readiness</CardTitle>
                            <CardDescription>Your personalized checklist for total domination.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Card>
                                <CardContent className="p-4 flex gap-2">
                                    <Input value={newPrepItem} onChange={e => setNewPrepItem(e.target.value)} placeholder="Add a new checklist item..." />
                                    <Button onClick={addPlacementPrepItem}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
                                </CardContent>
                            </Card>
                            <div className="space-y-3 pt-2">
                                {placementPrep.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 group">
                                        <Checkbox id={`prep-${index}`} checked={item.done} onCheckedChange={() => togglePlacementPrep(index)} />
                                        <Input
                                            value={item.text}
                                            onChange={(e) => handlePlacementPrepChange(index, e.target.value)}
                                            className={`p-0 h-auto border-none bg-transparent focus-visible:ring-0 ${item.done ? 'line-through text-muted-foreground' : ''}`}
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => deletePlacementPrepItem(index)} className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
        </Tabs>
    );
}
