import type { PropsWithChildren } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { QuoteProvider } from '@/context/QuoteContext';

export default function MainAppLayout({ children }: PropsWithChildren) {
  return (
    <QuoteProvider>
      <SidebarProvider>
        <Sidebar>
          <MainNav />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </QuoteProvider>
  );
}
