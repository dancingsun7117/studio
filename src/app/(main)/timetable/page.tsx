
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarClock } from 'lucide-react';

const TIMETABLE_STORAGE_KEY = 'weekly_timetable_v1';

const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const generateEmptyTimetable = () => {
  const timetable: Record<string, Record<string, string>> = {};
  daysOfWeek.forEach(day => {
    timetable[day] = {};
    timeSlots.forEach(slot => {
      timetable[day][slot] = '';
    });
  });
  return timetable;
};

export default function TimetablePage() {
  const [timetableData, setTimetableData] = useState(() => generateEmptyTimetable());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const savedData = localStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (savedData) {
        setTimetableData(JSON.parse(savedData));
      } else {
        setTimetableData(generateEmptyTimetable());
      }
    } catch (error) {
      console.error("Failed to load timetable data from localStorage", error);
      setTimetableData(generateEmptyTimetable());
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(timetableData));
      } catch (error) {
        console.error("Failed to save timetable data to localStorage", error);
      }
    }
  }, [timetableData, isClient]);

  const handleInputChange = (day: string, timeSlot: string, value: string) => {
    setTimetableData(prevData => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        [timeSlot]: value,
      },
    }));
  };
  
  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary flex items-center gap-3">
          <CalendarClock className="h-10 w-10" />
          Weekly Timetable
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your weekly lectures and recurring events. Your schedule, your command.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] min-w-[800px]">
              {/* Header Row */}
              <div className="font-headline text-primary p-4 border-b border-r">Time</div>
              {daysOfWeek.map(day => (
                <div key={day} className="font-headline text-primary p-4 text-center border-b border-r last:border-r-0">
                  {day}
                </div>
              ))}

              {/* Timetable Rows */}
              {timeSlots.map(slot => (
                <div key={slot} className="contents">
                  <div className="font-body text-sm text-muted-foreground p-4 border-b border-r flex items-center justify-center">
                    {slot}
                  </div>
                  {daysOfWeek.map(day => (
                    <div key={`${day}-${slot}`} className="border-b border-r last:border-r-0">
                      <Input
                        type="text"
                        placeholder="Lecture..."
                        value={timetableData[day]?.[slot] || ''}
                        onChange={e => handleInputChange(day, slot, e.target.value)}
                        className="w-full h-full p-2 border-none rounded-none focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-center"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
