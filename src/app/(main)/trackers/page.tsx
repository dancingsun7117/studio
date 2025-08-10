import { TrackersView } from '@/components/trackers';

export default function TrackersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Core Trackers
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Monitor your habits, finances, skills, and goals. Data is power.
        </p>
      </div>
      <TrackersView />
    </div>
  );
}
