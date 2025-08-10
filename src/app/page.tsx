import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CoverPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-background to-transparent bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 border-[10px] border-primary/20_!important" style={{ borderColor: 'hsl(var(--primary) / 0.2)' }}></div>
      <div className="absolute inset-2 border-[2px] border-primary/30_!important" style={{ borderColor: 'hsl(var(--primary) / 0.3)' }}></div>

      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-primary animate-fade-in-down">
          Planner 25-29
        </h1>
        <p className="mt-6 max-w-2xl font-body text-lg italic text-foreground/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          “In a world full of noise, she codes in silence and conquers in power.”
        </p>
        <p className="mt-2 font-body text-sm text-foreground/60 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          2025 – 2029
        </p>
        <Button asChild className="mt-12 group animate-fade-in-up" style={{ animationDelay: '0.4s' }} size="lg" variant="outline">
          <Link href="/dashboard">
            Enter The Planner
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
