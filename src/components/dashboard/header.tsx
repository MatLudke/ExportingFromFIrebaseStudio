import { UserNav } from './user-nav';
import { Logo } from '../logo';
import { MainNav } from './main-nav';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-20">
            <div className="container mx-auto max-w-4xl">
                <div className="mt-4 flex items-center justify-between rounded-2xl border bg-background/80 p-4 shadow-lg backdrop-blur-lg">
                    <Logo />
                    <MainNav />
                    <UserNav />
                </div>
            </div>
        </header>
    )
}
