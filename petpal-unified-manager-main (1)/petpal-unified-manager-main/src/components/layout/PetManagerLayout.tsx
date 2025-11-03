import { SidebarProvider } from "@/components/ui/sidebar";
import { PetManagerSidebar } from "./PetManagerSidebar";
import { PetManagerHeader } from "./PetManagerHeader";

interface PetManagerLayoutProps {
  children: React.ReactNode;
}

export function PetManagerLayout({ children }: PetManagerLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-pet-background">
        <PetManagerSidebar />
        <div className="flex-1 flex flex-col">
          <PetManagerHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}