import { Card, CardContent } from '@/components/ui/card';

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

const affirmations = [
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
];

export default function MotivationPage() {
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

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {affirmations.map((affirmation, index) => (
            <div key={index} className="break-inside-avoid p-4 rounded-lg bg-secondary">
                <p className="font-headline text-lg italic text-center">"{affirmation}"</p>
            </div>
        ))}
      </div>
    </div>
  );
}
