import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, GitCommit, BrainCircuit } from 'lucide-react';

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

export default function DashboardPage() {
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
