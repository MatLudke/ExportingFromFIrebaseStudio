"use client";

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { sendCode, verifyCode } from '@/ai/flows/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const { toast } = useToast();
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendCode({ email });
      setStep('code');
      toast({
        title: "Code Generated!",
        description: "Check your server console for the 6-digit code.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { valid } = await verifyCode({ email, code });
      if (valid) {
        toast({
          title: "Success!",
          description: "You are now logged in.",
        });
        // In a real app, you would now get a custom token and sign in with Firebase.
        // For this prototype, we will just redirect to the dashboard.
        router.push('/dashboard');
      } else {
        throw new Error("Invalid code. Please try again.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full border-none shadow-2xl shadow-black/10">
      <CardHeader className="text-center space-y-4">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-3xl font-headline tracking-tight">
          {step === 'email' ? 'Sign In / Sign Up' : 'Enter Your Code'}
        </CardTitle>
        <CardDescription>
          {step === 'email'
            ? 'Enter your email to receive a secure one-time code.'
            : `We've sent a 6-digit code to ${email}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleSendCode}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="py-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
             <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  required
                  className="py-6 text-center text-xl tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full py-6 text-base" disabled={loading}>
                {loading ? "Verifying..." : "Sign In"}
              </Button>
               <Button variant="link" size="sm" onClick={() => { setStep('email'); setCode(''); }}>
                Use a different email
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
