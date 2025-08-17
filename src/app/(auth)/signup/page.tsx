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
    <Card className="mx-auto max-w-sm w-full border-none shadow-2xl shadow-black/10">
      <CardHeader className="text-center space-y-4">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-3xl font-headline tracking-tight">Crie Sua Conta</CardTitle>
        <CardDescription>
          Comece sua jornada de produtividade hoje.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Nome Completo</Label>
            <Input id="full-name" placeholder="Seu Nome" required className="py-6"/>
          </div>
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
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required className="py-6"/>
          </div>
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox id="terms" required className="mt-1"/>
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              Eu aceito os <Link href="#" className="underline hover:text-primary">termos de serviço</Link> e a <Link href="#" className="underline hover:text-primary">política de privacidade</Link>.
            </Label>
          </div>
          <Button type="submit" className="w-full py-6 text-base" asChild>
            <Link href="/dashboard">Criar Conta Gratuitamente</Link>
          </Button>
        </div>
        <div className="mt-6 text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
