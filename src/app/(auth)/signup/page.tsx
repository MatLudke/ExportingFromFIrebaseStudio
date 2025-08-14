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
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="text-center">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-2xl font-headline">Criar Conta</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para começar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Nome Completo</Label>
            <Input id="full-name" placeholder="Seu Nome" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              Eu aceito os termos de serviço e a política de privacidade (LGPD).
            </Label>
          </div>
          <Button type="submit" className="w-full" asChild>
            <Link href="/dashboard">Criar conta</Link>
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
