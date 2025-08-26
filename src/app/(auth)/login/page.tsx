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
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/auth/callback`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "A sign-in link has been sent to your email address.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
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
          {emailSent ? "Check Your Inbox" : "Sign In or Create Account"}
        </CardTitle>
        <CardDescription>
          {emailSent 
            ? `We've sent a magic link to ${email}. Click the link to sign in.`
            : "Enter your email below to receive a sign-in link."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSent && (
          <form onSubmit={handleSignIn}>
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
                {loading ? "Sending..." : "Send Sign-In Link"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
