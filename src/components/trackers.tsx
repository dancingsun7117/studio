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
    { value: 'cgpa', label: 'CGPA Tracker', icon: GraduationCap },
    { value: 'finance', label: 'Finance Tracker', icon: DollarSign },
    { value: 'coding', label: 'Coding Skills', icon: GitBranch },
    { value: 'experience', label: 'Experience', icon: Briefcase },
    { value: 'events', label: 'Events & Orgs', icon: Trophy },
    { value: 'placement', label: 'Placement Prep', icon: Users },
    { value: 'goals', label: 'Goal Tracker', icon: Target },
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
    { description: 'Scholarship', amount: 1000, type: 'income' },
    { description: 'Freelance Project', amount: 200, type: 'income' },
    { description: 'Textbooks', amount: -150, type: 'expense' },
    { description: 'Coffee', amount: -50, type: 'expense' },
    { description: 'Pizza Night', amount: -100, type: 'expense' },
    { description: 'Team Dinner', amount: -500, type: 'expense' },
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
    const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense' });

    const addTransaction = () => {
        const amount = parseFloat(newTransaction.amount);
        if(newTransaction.description.trim() && !isNaN(amount)){
            const finalAmount = newTransaction.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
            setTransactions([...transactions, {description: newTransaction.description, amount: finalAmount, type: newTransaction.type}]);
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

    return (
        <Tabs defaultValue="habits" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                {trackerSections.map(section => (
                    <TabsTrigger key={section.value} value={section.value} className="flex gap-2">
                        <section.icon className="h-4 w-4" /> {section.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="habits">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Weekly Habit Tracker</CardTitle>
                        <CardDescription>Consistency is the key to mastery.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Habit</TableHead>
                                    <TableHead>M</TableHead>
                                    <TableHead>T</TableHead>
                                    <TableHead>W</TableHead>
                                    <TableHead>T</TableHead>
                                    <TableHead>F</TableHead>
                                    <TableHead>S</TableHead>
                                    <TableHead>S</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {habits.map((habit, habitIndex) => (
                                    <TableRow key={habitIndex}>
                                        <TableCell>
                                            <Input 
                                                value={habit.name} 
                                                onChange={(e) => handleHabitNameChange(habitIndex, e.target.value)}
                                                className="border-none bg-transparent p-0 focus-visible:ring-0"
                                            />
                                        </TableCell>
                                        {habit.days.map((day, dayIndex) => (
                                            <TableCell key={dayIndex}>
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
                         <div className="mt-4 flex gap-2">
                            <Input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Add a new habit..." />
                            <Button onClick={addHabit}><PlusCircle className="mr-2 h-4 w-4" />Add Habit</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="cgpa">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">CGPA Tracker</CardTitle>
                        <CardDescription>Track your academic performance semester-wise.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="text-sm font-medium">Current CGPA</label><Input type="number" value={cgpa.current} onChange={e => setCgpa({...cgpa, current: e.target.value})} /></div>
                           <div><label className="text-sm font-medium">Goal CGPA</label><Input type="number" value={cgpa.goal} onChange={e => setCgpa({...cgpa, goal: e.target.value})} /></div>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead>Semester</TableHead><TableHead>SGPA</TableHead><TableHead>Credits</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {semesters.map((sem, i) => (
                                    <TableRow key={i}>
                                        <TableCell>Semester {i+1}</TableCell>
                                        <TableCell><Input type="number" placeholder="-" value={sem.sgpa} onChange={e => handleSemesterChange(i, 'sgpa', e.target.value)} /></TableCell>
                                        <TableCell><Input type="number" placeholder="-" value={sem.credits} onChange={e => handleSemesterChange(i, 'credits', e.target.value)} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="finance">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Finance Tracker</CardTitle>
                        <CardDescription>Manage your college and personal finances.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                           <Card><CardHeader><CardTitle className="text-green-500">${totalIncome.toFixed(2)}</CardTitle><CardDescription>Total Income</CardDescription></CardHeader></Card>
                           <Card><CardHeader><CardTitle className="text-red-500">${Math.abs(totalExpenses).toFixed(2)}</CardTitle><CardDescription>Total Expenses</CardDescription></CardHeader></Card>
                           <Card><CardHeader><CardTitle>${(totalIncome + totalExpenses).toFixed(2)}</CardTitle><CardDescription>Balance</CardDescription></CardHeader></Card>
                        </div>
                         <div className="flex gap-2">
                            <Input value={newTransaction.description} onChange={e => handleTransactionChange('description', e.target.value)} placeholder="Description" />
                            <Input type="number" value={newTransaction.amount} onChange={e => handleTransactionChange('amount', e.target.value)} placeholder="Amount" />
                             <Select value={newTransaction.type} onValueChange={(value) => handleTransactionChange('type', value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={addTransaction}><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {transactions.map((t, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{t.description}</TableCell>
                                        <TableCell className={t.amount > 0 ? 'text-green-500' : 'text-red-500'}>${t.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => deleteTransaction(i)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="coding">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Coding Skill Tracker</CardTitle>
                        <CardDescription>Track your progress in DSA, LeetCode, and other skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-primary">{skill.name}</span>
                                        <Input 
                                            type="number" 
                                            className="w-20 h-7 text-sm" 
                                            value={skill.value} 
                                            onChange={e => handleSkillChange(index, parseInt(e.target.value, 10))}
                                            max={100}
                                            min={0}
                                         />
                                    </div>
                                    <Progress value={skill.value} />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteSkill(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <div className="mt-4 flex gap-2">
                            <Input value={newSkill.name} onChange={e => handleNewSkillChange('name', e.target.value)} placeholder="Add a new skill..." />
                            <Input type="number" value={newSkill.value} onChange={e => handleNewSkillChange('value', e.target.value)} placeholder="Initial %" className="w-24" />
                            <Button onClick={addSkill}><PlusCircle className="mr-2 h-4 w-4" />Add Skill</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="experience">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Experience Tracker</CardTitle>
                        <CardDescription>Log your internships, projects, and research.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Title/Organization</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                             <TableBody>
                                {experience.map((exp, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Input value={exp.type} onChange={e => handleExperienceChange(index, 'type', e.target.value)} /></TableCell>
                                        <TableCell><Input value={exp.title} onChange={e => handleExperienceChange(index, 'title', e.target.value)} /></TableCell>
                                        <TableCell><Input value={exp.duration} onChange={e => handleExperienceChange(index, 'duration', e.target.value)} /></TableCell>
                                        <TableCell><Input value={exp.status} onChange={e => handleExperienceChange(index, 'status', e.target.value)} /></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteExperience(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                             </TableBody>
                        </Table>
                         <Button className="mt-4" onClick={addExperience}><PlusCircle className="mr-2 h-4 w-4"/> Add New Entry</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="events">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Involvement Tracker</CardTitle>
                        <CardDescription>Keep track of tech events, hackathons, and club involvements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                             <TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Role/Contribution</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                             <TableBody>
                                {involvement.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Input value={item.activity} onChange={e => handleInvolvementChange(index, 'activity', e.target.value)} /></TableCell>
                                        <TableCell><Input value={item.contribution} onChange={e => handleInvolvementChange(index, 'contribution', e.target.value)} /></TableCell>
                                        <TableCell><Input value={item.date} onChange={e => handleInvolvementChange(index, 'date', e.target.value)} /></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteInvolvement(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                             </TableBody>
                        </Table>
                         <Button className="mt-4" onClick={addInvolvement}><PlusCircle className="mr-2 h-4 w-4"/> Add Involvement</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="placement">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Placement Readiness Tracker</CardTitle>
                        <CardDescription>Create your personalized checklist for placement preparation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {placementPrep.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Checkbox id={`prep-${index}`} checked={item.done} onCheckedChange={() => togglePlacementPrep(index)} />
                                <label htmlFor={`prep-${index}`} className="flex-1">{item.text}</label>
                                 <Button variant="ghost" size="icon" onClick={() => deletePlacementPrepItem(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <div className="mt-4 flex gap-2">
                            <Input value={newPrepItem} onChange={e => setNewPrepItem(e.target.value)} placeholder="Add new prep item..." />
                            <Button onClick={addPlacementPrepItem}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="goals">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Goal Tracker</CardTitle>
                        <CardDescription>Set and conquer your academic, personal, and financial goals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {(['Academic', 'Personal', 'Financial'] as const).map(category => (
                                <div key={category}>
                                    <h3 className="font-bold text-accent mb-2">{category}</h3>
                                    <ul className="space-y-2">
                                        {goals.filter(g => g.category === category).map((goal, index) => {
                                            const originalIndex = goals.findIndex(g => g.text === goal.text && g.category === goal.category);
                                            return (
                                                <li key={originalIndex} className="flex items-center gap-2">
                                                    <Checkbox checked={goal.done} onCheckedChange={() => toggleGoal(originalIndex)}/>
                                                    <span className="flex-1">{goal.text}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteGoal(originalIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div className="mt-4 flex gap-2">
                                        <Input 
                                            placeholder={`New ${category} goal...`}
                                            value={newGoal.category === category ? newGoal.text : ''}
                                            onChange={e => setNewGoal({text: e.target.value, category})}
                                        />
                                        <Button onClick={() => addGoal(category)} size="icon"><PlusCircle className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    );
}
