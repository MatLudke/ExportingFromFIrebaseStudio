import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Lexend } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700', '800']
});

export const metadata: Metadata = {
  title: 'Tempo Certo',
  description: 'Sua jornada para estudos mais produtivos começa aqui.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable, lexend.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
