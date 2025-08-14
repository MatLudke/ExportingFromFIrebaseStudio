import { Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <Hourglass className="h-8 w-8" />
      <span className="text-xl font-bold font-headline">Tempo Certo</span>
    </div>
  );
}
