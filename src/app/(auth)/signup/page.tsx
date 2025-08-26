"use client";

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
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async () => {
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de serviço para criar uma conta.",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: fullName,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Você agora pode fazer login.",
      });

      router.push('/login');
    } catch (error: any) {
      let description = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/weak-password') {
        description = "Sua senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
      }
      toast({
        variant: "destructive",
        title: "Erro na Criação da Conta",
        description,
      });
    }
  };


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
            <Input 
              id="full-name" 
              placeholder="Seu Nome" 
              required 
              className="py-6"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="py-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              className="py-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="terms" 
              required 
              className="mt-1"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              Eu aceito os <Link href="#" className="underline hover:text-primary">termos de serviço</Link> e a <Link href="#" className="underline hover:text-primary">política de privacidade</Link>.
            </Label>
          </div>
          <Button type="submit" className="w-full py-6 text-base" onClick={handleSignup}>
            Criar Conta Gratuitamente
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
