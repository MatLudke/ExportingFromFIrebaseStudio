import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
          <Logo />
          <CardTitle className="text-3xl font-bold text-primary mt-4 font-headline">
            Bem-vindo ao Tempo Certo
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sua jornada para estudos mais produtivos começa aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
