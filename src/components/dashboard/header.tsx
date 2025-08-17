import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm md:px-8">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <h1 className="flex-1 text-2xl font-bold tracking-tight font-headline">{title}</h1>
            <UserNav />
        </header>
    )
}
