import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-sm w-full border-none shadow-2xl shadow-black/10">
      <CardHeader className="text-center space-y-4">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-3xl font-headline tracking-tight">Bem-vindo de Volta</CardTitle>
        <CardDescription>
          Acesse sua conta para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="py-6"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input id="password" type="password" required className="py-6" />
          </div>
          <Button type="submit" className="w-full py-6 text-base" asChild>
            <Link href="/dashboard">Entrar</Link>
          </Button>
        </div>
        <div className="mt-6 text-center text-sm">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
