"use client";

import { Textarea } from '@/components/ui/textarea';
import { MafiaSealIcon } from '@/components/icons';

export default function NotesPage() {
  const dotGridStyle = {
    backgroundImage: 
      'radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)',
    backgroundSize: '20px 20px',
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Notes & Schematics
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A secure place for your thoughts, plans, and secret algorithms.
        </p>
      </div>
      <div className="relative flex-1">
        <MafiaSealIcon className="absolute bottom-8 right-8 h-32 w-32 text-foreground/5 opacity-50 pointer-events-none" />
        <Textarea
          placeholder="Start typing your master plan..."
          className="h-full min-h-[50vh] w-full resize-none text-lg font-body"
          style={dotGridStyle}
        />
      </div>
    </div>
  );
}
