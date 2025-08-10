"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookText,
  CalendarDays,
  Gem,
  LayoutDashboard,
  Sparkles,
  Target,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/trackers', icon: Target, label: 'Core Trackers' },
  { href: '/planner', icon: CalendarDays, label: 'Academic Planner' },
  { href: '/motivation', icon: Sparkles, label: 'Motivation' },
  { href: '/notes', icon: BookText, label: 'Notes' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/20">
            <Gem className="h-6 w-6 text-primary" />
          </div>
          <span className="font-headline text-2xl font-bold text-primary">
            Neeshna&apos;s Codex
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="font-body"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="items-center text-center">
        <Separator className="mb-2" />
        <p className="font-headline text-sm text-muted-foreground px-2">
          &ldquo;She didn&apos;t chase the top — she built it.&rdquo;
        </p>
      </SidebarFooter>
    </>
  );
}
