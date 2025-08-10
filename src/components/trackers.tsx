"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, DollarSign, GitBranch, GraduationCap, Trophy, Users, Briefcase } from 'lucide-react';

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

export function TrackersView() {
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
                                    <TableHead>Habit</TableHead>
                                    <TableHead>M</TableHead>
                                    <TableHead>T</TableHead>
                                    <TableHead>W</TableHead>
                                    <TableHead>T</TableHead>
                                    <TableHead>F</TableHead>
                                    <TableHead>S</TableHead>
                                    <TableHead>S</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {['Code for 2 hours', 'Review DSA Concepts', 'Workout', 'Read a Tech Article', 'Connect with 1 person on LinkedIn'].map(habit => (
                                    <TableRow key={habit}>
                                        <TableCell>{habit}</TableCell>
                                        {[...Array(7)].map((_, i) => <TableCell key={i}><Checkbox /></TableCell>)}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
                           <div><label className="text-sm font-medium">Current CGPA</label><Input type="number" defaultValue="8.5" /></div>
                           <div><label className="text-sm font-medium">Goal CGPA</label><Input type="number" defaultValue="9.0" /></div>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead>Semester</TableHead><TableHead>SGPA</TableHead><TableHead>Credits</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {[...Array(8)].map((_, i) => (
                                    <TableRow key={i}><TableCell>Semester {i+1}</TableCell><TableCell><Input type="number" placeholder="-" /></TableCell><TableCell><Input type="number" placeholder="-" /></TableCell></TableRow>
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
                        <div className="grid grid-cols-2 gap-4">
                           <Card><CardHeader><CardTitle>$1,200</CardTitle><CardDescription>Monthly Income</CardDescription></CardHeader></Card>
                           <Card><CardHeader><CardTitle>$800</CardTitle><CardDescription>Monthly Expenses</CardDescription></CardHeader></Card>
                        </div>
                        <Input placeholder="Add new transaction (e.g., +50 for coffee book)" />
                        <Button>Add Transaction</Button>
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
                        {['Data Structures', 'Algorithms', 'System Design', 'LeetCode (Easy)', 'LeetCode (Medium)', 'LeetCode (Hard)'].map(skill => (
                            <div key={skill}>
                                <div className="flex justify-between mb-1"><span className="text-base font-medium text-primary">{skill}</span><span className="text-sm font-medium">{(Math.random() * 100).toFixed(0)}%</span></div>
                                <Progress value={Math.random() * 100} />
                            </div>
                        ))}
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
                             <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Title/Organization</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                             <TableBody>
                                <TableRow><TableCell>Internship</TableCell><TableCell><Input defaultValue="SDE Intern @ Google" /></TableCell><TableCell><Input defaultValue="May 2026 - Aug 2026"/></TableCell><TableCell><Input defaultValue="Completed"/></TableCell></TableRow>
                                <TableRow><TableCell>Project</TableCell><TableCell><Input defaultValue="AI-Powered Planner" /></TableCell><TableCell><Input defaultValue="Jan 2025 - Mar 2025"/></TableCell><TableCell><Input defaultValue="In Progress"/></TableCell></TableRow>
                                <TableRow><TableCell>Research</TableCell><TableCell><Input defaultValue="Quantum Computing Applications"/></TableCell><TableCell><Input defaultValue="Ongoing"/></TableCell><TableCell><Input defaultValue="Ongoing"/></TableCell></TableRow>
                             </TableBody>
                        </Table>
                         <Button className="mt-4">Add New Entry</Button>
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
                             <TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Role/Contribution</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                             <TableBody>
                                <TableRow><TableCell><Input defaultValue="Hacktoberfest"/></TableCell><TableCell><Input defaultValue="Contributor (5 PRs)"/></TableCell><TableCell><Input defaultValue="Oct 2025"/></TableCell></TableRow>
                                <TableRow><TableCell><Input defaultValue="Women in Tech Club"/></TableCell><TableCell><Input defaultValue="President"/></TableCell><TableCell><Input defaultValue="2026-2027"/></TableCell></TableRow>
                             </TableBody>
                        </Table>
                         <Button className="mt-4">Add Involvement</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="placement">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Placement Readiness Tracker</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2"><Checkbox id="resume" defaultChecked/><label htmlFor="resume">Resume Updated & Tailored</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="apti"/><label htmlFor="apti">Aptitude Practice (5/10 tests)</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="tech"/><label htmlFor="tech">Technical Mock Interviews (2/5)</label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="hr"/><label htmlFor="hr">HR Mock Interviews (1/2)</label></div>
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
                            <div><h3 className="font-bold text-accent mb-2">Academic</h3><ul><li className="flex items-center gap-2"><Checkbox defaultChecked/> Maintain 9+ CGPA</li></ul></div>
                            <div><h3 className="font-bold text-accent mb-2">Personal</h3><ul><li className="flex items-center gap-2"><Checkbox /> Read 12 books this year</li></ul></div>
                            <div><h3 className="font-bold text-accent mb-2">Financial</h3><ul><li className="flex items-center gap-2"><Checkbox /> Save $5000 for post-grad trip</li></ul></div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    );
}
