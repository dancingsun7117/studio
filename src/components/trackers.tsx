"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, GitBranch, GraduationCap, Trophy, Users, Briefcase, Target, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const trackerSections = [
    { value: 'habits', label: 'Habit Tracker', icon: CheckCircle },
    { value: 'goals', label: 'Goal Tracker', icon: Target },
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
    { description: 'Pizza Night', amount: -100, type: 'expense' as const },
    { description: 'Team Dinner', amount: -500, type: 'expense' as const },
]

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


export function TrackersView() {
    // State for Habit Tracker
    const [habits, setHabits] = useState(initialHabits);
    const [newHabit, setNewHabit] = useState('');

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
        const newHabits = habits.filter((_, index) => index !== habitIndex);
        setHabits(newHabits);
    }

    // State for CGPA Tracker
    const [semesters, setSemesters] = useState(initialSemesters);
    const [cgpa, setCgpa] = useState({current: '8.5', goal: '9.0'});

    const handleSemesterChange = (index: number, field: 'sgpa' | 'credits', value: string) => {
        const newSemesters = [...semesters];
        newSemesters[index][field] = value;
        setSemesters(newSemesters);
    }
    
    // State for Finance Tracker
    const [transactions, setTransactions] = useState(initialTransactions);
    const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense' as const });

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
    
    const handleTransactionChange = (field: keyof typeof newTransaction, value: string) => {
        setNewTransaction(prev => ({...prev, [field]: value}));
    }

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);


    // State for Coding Skills
    const [skills, setSkills] = useState(initialSkills);
    const [newSkill, setNewSkill] = useState({name: '', value: 50});

    const handleSkillChange = (index: number, value: number) => {
        const newSkills = [...skills];
        newSkills[index].value = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
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
    const [experience, setExperience] = useState(initialExperience);
    const addExperience = () => setExperience([...experience, { type: '', title: '', duration: '', status: '' }]);
    const deleteExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));
    const handleExperienceChange = (index: number, field: keyof typeof experience[0], value: string) => {
        const newExperience = [...experience];
        newExperience[index][field] = value;
        setExperience(newExperience);
    }


    // State for Involvement Tracker
    const [involvement, setInvolvement] = useState(initialInvolvement);
    const addInvolvement = () => setInvolvement([...involvement, { activity: '', contribution: '', date: '' }]);
    const deleteInvolvement = (index: number) => setInvolvement(involvement.filter((_, i) => i !== index));
    const handleInvolvementChange = (index: number, field: keyof typeof involvement[0], value: string) => {
        const newInvolvement = [...involvement];
        newInvolvement[index][field] = value;
        setInvolvement(newInvolvement);
    }

    // State for Placement Prep
    const [placementPrep, setPlacementPrep] = useState(initialPlacementPrep);
    const [newPrepItem, setNewPrepItem] = useState('');

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
    const [goals, setGoals] = useState(initialGoals);
    const [newGoal, setNewGoal] = useState({text: '', category: 'Academic'});
    
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


    return (
        <Tabs defaultValue="habits" className="w-full" orientation="vertical">
            <TabsList className="w-full md:w-48 grid grid-cols-2 md:grid-cols-1 md:h-full">
                {trackerSections.map(section => (
                    <TabsTrigger key={section.value} value={section.value} className="flex gap-2 justify-start p-4">
                        <section.icon className="h-5 w-5" /> <span className="hidden md:inline">{section.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="habits" className="pt-0">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">Weekly Habit Tracker</CardTitle>
                        <CardDescription>Consistency is the key to mastery. Check off your habits daily.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex gap-2">
                            <Input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Add a new daily habit..." />
                            <Button onClick={addHabit}><PlusCircle className="mr-2 h-4 w-4" />Add Habit</Button>
                        </div>
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
            
             <TabsContent value="goals" className="pt-0">
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

            <TabsContent value="cgpa" className="pt-0">
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

            <TabsContent value="coding" className="pt-0">
                 <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">Coding Skill Tracker</CardTitle>
                        <CardDescription>Track your proficiency. Every line of code builds the empire.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Card className="bg-background/50">
                            <CardContent className="p-4 flex gap-2">
                                <Input value={newSkill.name} onChange={e => handleNewSkillChange('name', e.target.value)} placeholder="Add a new skill to master..." />
                                <Input type="number" value={newSkill.value} onChange={e => handleNewSkillChange('value', e.target.value)} placeholder="%" className="w-24" />
                                <Button onClick={addSkill}><PlusCircle className="mr-2 h-4 w-4" />Add Skill</Button>
                            </CardContent>
                         </Card>
                         <div className="space-y-6 pt-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <Input
                                                value={skill.name}
                                                onChange={(e) => handleSkillNameChange(index, e.target.value)}
                                                className="text-base font-semibold text-foreground p-0 h-auto border-none bg-transparent focus-visible:ring-0"
                                            />
                                            <span className="text-sm font-medium text-primary">{skill.value}%</span>
                                        </div>
                                        <Progress value={skill.value} className="h-2"/>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteSkill(index)} className="opacity-0 group-hover:opacity-100">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="finance" className="pt-0">
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

            <TabsContent value="experience" className="pt-0">
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
                                            <TableCell><Input value={exp.type} onChange={e => handleExperienceChange(index, 'type', e.target.value)} className="font-semibold" /></TableCell>
                                            <TableCell><Input value={exp.title} onChange={e => handleExperienceChange(index, 'title', e.target.value)} /></TableCell>
                                            <TableCell><Input value={exp.duration} onChange={e => handleExperienceChange(index, 'duration', e.target.value)} /></TableCell>
                                            <TableCell><Input value={exp.status} onChange={e => handleExperienceChange(index, 'status', e.target.value)} /></TableCell>
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

            <TabsContent value="events" className="pt-0">
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

            <TabsContent value="placement" className="pt-0">
                 <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">Placement Readiness</CardTitle>
                        <CardDescription>Your personalized checklist for total domination.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Card className="bg-background/50">
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

        </Tabs>
    );
}
